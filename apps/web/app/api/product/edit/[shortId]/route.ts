import { v4 as uuidv4 } from 'uuid';
import { decodeShortId } from '@/shared/lib/shortUuid';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: Promise<{ shortId: string }> }) {
  const resolvedParams = await params;
  const id = decodeShortId(resolvedParams.shortId);

  try {
    // 1. 먼저 경매 정보만 가져오기
    const { data: imageData, error: imageError } = await supabase
      .from('product')
      .select(
        `
                *,
                product_image (*),
                pending_auction(min_price, auction_end_at)
            `
      )
      .eq('product_id', id)
      .single();

    if (imageError || !imageData) {
      return NextResponse.json(
        {
          error: 'Image not found',
          details: imageError?.message,
          shortId: resolvedParams.shortId,
          decodedId: id,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(imageData);
  } catch (err) {
    return NextResponse.json({ error: '서버 내부 오류 발생' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { shortId: string } }) {
  const formData = await request.formData();
  const productId = decodeShortId(params.shortId);
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const minPrice = formData.get('min_price') as string;
  const endAt = formData.get('end_at') as string;

  // 새로 업로드할 파일들
  const newImageFiles = formData.getAll('images') as File[];

  // 이미지 순서 정보 파싱
  const imageOrders: { index: number; id: string }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('image_order_')) {
      const index = parseInt(key.replace('image_order_', ''));
      imageOrders.push({ index, id: value as string });
    }
  }

  // 이미지 변경 여부 확인
  const hasImageChanges = newImageFiles.length > 0 || imageOrders.length > 0;

  try {
    // STEP 0: 수정 제한 시간 체크
    const { data: pending, error: pendingError } = await supabase
      .from('pending_auction')
      .select('scheduled_create_at')
      .eq('product_id', productId)
      .maybeSingle();

    if (pendingError) {
      throw new Error(`경매 제한 시간 조회 실패: ${pendingError.message}`);
    }

    if (!pending || !pending.scheduled_create_at) {
      return NextResponse.json(
        { error: '경매 제한 시간이 설정되어 있지 않습니다.' },
        { status: 400 }
      );
    }

    const scheduledTime = new Date(pending.scheduled_create_at);
    const now = new Date();

    if (now > scheduledTime) {
      return NextResponse.json({ error: '상품 수정 가능 시간이 만료되었습니다.' }, { status: 403 });
    }

    // STEP 1: product 테이블 업데이트
    const { error: productUpdateError } = await supabase
      .from('product')
      .update({
        title,
        category,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq('product_id', productId);

    if (productUpdateError) {
      throw new Error(`상품 정보 업데이트 실패: ${productUpdateError.message}`);
    }

    // STEP 2: pending_auction 테이블 업데이트
    const { error: pendingUpdateError } = await supabase
      .from('pending_auction')
      .update({
        min_price: parseInt(minPrice),
        auction_end_at: endAt,
        updated_at: new Date().toISOString(),
      })
      .eq('product_id', productId);

    if (pendingUpdateError) {
      throw new Error(`경매 정보 업데이트 실패: ${pendingUpdateError.message}`);
    }

    // STEP 3: 이미지 처리 로직 (변경이 있는 경우에만)
    if (hasImageChanges) {
      // 3-1: 기존 이미지 데이터 조회
      const { data: existingImages, error: fetchError } = await supabase
        .from('product_image')
        .select('*')
        .eq('product_id', productId)
        .order('order_index');

      if (fetchError) {
        throw new Error(`기존 이미지 조회 실패: ${fetchError.message}`);
      }

      // 3-2: 새 이미지 업로드
      const uploadedImageUrls: string[] = [];
      for (const file of newImageFiles) {
        const ext = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${ext}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-image')
          .upload(filePath, file, { contentType: file.type });

        if (uploadError) {
          throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage.from('product-image').getPublicUrl(filePath);
        uploadedImageUrls.push(urlData.publicUrl);
      }

      // 3-3: 기존 이미지 중 유지할 것들과 삭제할 것들 구분
      // 기존 이미지 ID만 골라내기 (새 이미지 'NEW_IMAGE_x' 제외)
      const orderExistingImageIds = imageOrders
        .filter((order) => !order.id.startsWith('NEW_IMAGE_'))
        .map((order) => order.id);

      // 삭제할 이미지: 기존에 있었지만 클라이언트에서 유지하지 않은 이미지
      const imagesToDelete = existingImages.filter(
        (img) => !orderExistingImageIds.includes(img.image_id.toString())
      );

      // 3-4: 삭제할 이미지들 제거
      if (imagesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('product_image')
          .delete()
          .in(
            'image_id',
            imagesToDelete.map((img) => img.image_id)
          );

        if (deleteError) {
          throw new Error(`이미지 삭제 실패: ${deleteError.message}`);
        }
      }

      // 3-5: 이미지 순서 재정렬 및 새 이미지 추가
      let newImageIndex = 0;

      for (const orderInfo of imageOrders) {
        if (orderInfo.id.startsWith('NEW_IMAGE_')) {
          // 새 이미지 추가
          if (newImageIndex < uploadedImageUrls.length) {
            const { error: insertError } = await supabase.from('product_image').insert({
              product_id: productId,
              image_url: uploadedImageUrls[newImageIndex],
              order_index: orderInfo.index === 0 ? 0 : 1, // 첫 번째는 메인(0), 나머지는 일반(1)
            });

            if (insertError) {
              throw new Error(`새 이미지 추가 실패: ${insertError.message}`);
            }
            newImageIndex++;
          }
        } else {
          // 기존 이미지 순서 업데이트
          const { error: updateError } = await supabase
            .from('product_image')
            .update({
              order_index: orderInfo.index === 0 ? 0 : 1, // 첫 번째는 메인(0), 나머지는 일반(1)
            })
            .eq('image_id', orderInfo.id);

          if (updateError) {
            throw new Error(`이미지 순서 업데이트 실패: ${updateError.message}`);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: '상품이 성공적으로 수정되었습니다.',
    });
  } catch (error) {
    console.error('상품 수정 중 오류 발생:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '상품 수정 실패' },
      { status: 500 }
    );
  }
}
