import { decodeShortId } from '@/shared/lib/shortUuid';
import { supabase } from '@/shared/lib/supabaseClient';
import { notFound } from 'next/navigation';
import ProductImageSlider from './ProductImageSlider';
import { AlarmClock, PencilLine } from 'lucide-react';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { formatTimestamptz } from '@/shared/lib/formatTimestamp';
import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import BottomBar from './BottomBar';

const ProductDetailPage = async ({ params }: { params: { shortId: string } }) => {
  // test용 shorId  = uRMUuxqfyznoNTZhFmvhx4
  const param = await params;
  const uuid = decodeShortId(param.shortId);

  const { data, error } = await supabase
    .from('auction')
    .select(
      `
            *,
            product (
            *,
            exhibit_user:exhibit_user_id (
                *
            ),
            product_image (
                *
            )
            )
        `
    )
    .eq('auction_id', uuid)
    .single();

  if (error || !data) return notFound();
  console.log(data);

  const auction = data;
  const mapped = {
    auctionId: auction.auction_id,
    productTitle: auction.product?.title,
    productDescription: auction.product?.description,
    images: auction.product?.product_image ?? [],
    minPrice: auction.min_price,
    auctionEndAt: auction.auction_end_at,
    exhibitUser: auction.product?.exhibit_user,
  };

  return (
    <div className="flex flex-col gap-[25px] pb-[50px]">
      {/* 이미지 슬라이더 */}
      <ProductImageSlider images={mapped.images} />
      {/* 경매 상품 내용 */}
      <div className="typo-subtitle-bold">{mapped.productTitle}</div>
      <div>
        <div className="typo-caption-regular text-neutral-600">최고 입찰가</div>
        <div className="typo-subtitle-bold">{'20,000원'}</div>
      </div>
      <div className="bg-neutral-050 flex w-full items-center justify-between px-[12px] py-[9px]">
        <div className="flex items-center gap-[10px]">
          <div className="flex items-center gap-[3px]">
            <PencilLine size={12} className="text-neutral-600" />
            <div className="text-[10px] text-neutral-600">입찰 시작가</div>
          </div>
          <div className="typo-caption-medium">{formatNumberWithComma(mapped.minPrice)}원</div>
        </div>
        <div className="h-[12px] w-[1px] bg-neutral-300"></div>
        <div className="flex items-center gap-[10px]">
          <div className="flex items-center gap-[3px]">
            <AlarmClock size={12} className="text-neutral-600" />
            <div className="text-[10px] text-neutral-600">입찰 마감 일자</div>
          </div>
          <div className="typo-caption-medium">{formatTimestamptz(mapped.auctionEndAt)}</div>
        </div>
      </div>
      <div className="typo-body-regular">{mapped.productDescription}</div>
      <div className="h-[8px] w-full bg-neutral-100"></div>
      {/* 입찰현황판 */}
      {/* <div className="h-[8px] w-full bg-neutral-100"></div> */}
      <div className="flex items-center gap-[19px]">
        <Avatar src={mapped.exhibitUser?.profile_img || undefined} className="size-[36px]" />
        <div className="flex flex-col gap-[5px]">
          <div className="typo-body-medium">{mapped.exhibitUser.nickname}</div>
          <div className="typo-caption-regular">{mapped.exhibitUser.address}</div>
        </div>
      </div>
      <BottomBar auctionEndAt={mapped.auctionEndAt} />
    </div>
  );
};

export default ProductDetailPage;
