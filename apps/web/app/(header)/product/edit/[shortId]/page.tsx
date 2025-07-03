'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import { Input } from '@repo/ui/components/Input/Input';
import { Textarea } from '@repo/ui/components/Textarea/Textarea';
import { Button } from '@repo/ui/components/Button/Button';
import { useRouter } from 'next/navigation';
import ImageUploadPreview, { UploadedImage } from '@/shared/lib/ImageUploadPreview';
import Loading from '@/shared/ui/Loading/Loading';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { ProductImage } from '@/app/api/product/route';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/components/Select/Select';
import { categories, CategoryValue } from '@/features/category/types';

type PendingAuction = {
  min_price: number;
  auction_end_at: string;
  scheduled_create_at: string;
};

type ProductData = {
  product_id: string;
  title: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  product_image: ProductImage[];
  pending_auction: PendingAuction[];
};

const ProductEditPage = ({ params }: { params: Promise<{ shortId: string }> }) => {
  const resolvedParams = use(params);
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mappedImages: UploadedImage[] = useMemo(() => {
    if (!data?.product_image) return [];

    return [...data.product_image]
      .sort((a, b) => a.order_index - b.order_index)
      .map((img, index) => ({
        id: img.image_id,
        file: null,
        preview: img.image_url,
        order_index: index,
      }));
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/product/edit/${resolvedParams.shortId}`);

        if (!response.ok) {
          throw new Error('상품 정보를 가져올 수 없습니다.');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.shortId]);

  useEffect(() => {
    if (data) {
      const auction = data.pending_auction?.[0];
      setTitle(data.title || '');
      setCategory(data.category || '');
      setDescription(data.description || '');
      setMinPrice(auction?.min_price ? formatNumberWithComma(auction.min_price.toString()) : '');

      if (auction?.auction_end_at) {
        const end = new Date(auction?.auction_end_at);
        setEndDate(end.toISOString().slice(0, 10)); // 'YYYY-MM-DD'
        setEndTime(end.toTimeString().slice(0, 5)); // 'HH:MM'
      }
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <p>오류: {error}</p>;
  if (!data) return <p>상품 정보를 찾을 수 없습니다.</p>;

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numericOnly = raw.replace(/\D/g, '');
    const formatted = formatNumberWithComma(numericOnly);
    setMinPrice(formatted);
  };

  const handleSubmit = async () => {
    const auction = data?.pending_auction?.[0];
    const deadline = auction?.scheduled_create_at ? new Date(auction.scheduled_create_at) : null;
    const now = new Date();

    if (deadline && now > deadline) {
      alert('상품 수정 가능 시간이 만료되었습니다!');
      router.back();
      return;
    }

    if (
      !title ||
      !category ||
      !description ||
      !minPrice ||
      !endDate ||
      !endTime ||
      images.length === 0
    ) {
      alert('모든 필수 항목을 입력해 주세요');
      return;
    }

    setIsSubmitting(true);

    const endAt = new Date(`${endDate}T${endTime}`);
    const numericPrice = parseInt(minPrice.replace(/,/g, ''), 10);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('min_price', numericPrice.toString());
    formData.append('category', category);
    formData.append('end_at', endAt.toISOString());

    images.forEach((img, index) => {
      if (img.file) {
        // 새 이미지
        formData.append('images', img.file);
        formData.append(`image_order_${index}`, `NEW_IMAGE_${index}`);
      } else {
        // 기존 이미지
        formData.append(`image_order_${index}`, img.id);
      }
    });
    try {
      const res = await fetch(`/api/product/edit/${resolvedParams.shortId}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        alert(`수정 실패: ${error}`);
        return;
      }

      alert('수정이 완료되었습니다!');
      setTimeout(() => {
        router.push('/auction/listings');
      }, 0);
    } catch (err) {
      console.error('수정 에러', err);
      alert('알 수 없는 오류가 발생했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[26px] pt-[16px]">
      <div className="p-box flex flex-col gap-[26px]">
        {/* 사진 업로드 */}
        <ImageUploadPreview exImages={mappedImages} onImagesChange={setImages} />
        {/* 사용자 입력 항목 */}
        <div className="flex flex-col gap-[13px]">
          <div className="typo-subtitle-small-medium">
            상품 제목<span className="text-main">*</span>
          </div>
          <Input
            placeholder="상품 제목을 입력해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-[13px]">
          <div className="typo-subtitle-small-medium">
            카테고리<span className="text-main">*</span>
          </div>
          <Select value={category} onValueChange={(value) => setCategory(value as CategoryValue)}>
            <SelectTrigger className="typo-body-regular rounded-sm px-[10.5px]">
              <SelectValue placeholder="카테고리를 선택해 주세요." />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter((category) => category.value !== 'all')
                .map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-[13px]">
          <div className="typo-subtitle-small-medium">
            자세한 설명<span className="text-main">*</span>
          </div>
          <Textarea
            className="h-[204px]"
            placeholder="상품의 상태, 구매 시기, 사용감 등을 자세히 설명해 주세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="h-[8px] w-full bg-neutral-100"></div>
      <div className="p-box flex flex-col gap-[26px]">
        <div className="flex flex-col gap-[13px]">
          <div className="typo-subtitle-small-medium">
            입찰 시작가<span className="text-main">*</span>
          </div>
          <div className="flex items-end">
            <Input
              value={minPrice}
              onChange={handleMinPriceChange}
              placeholder="희망하는 최소 입찰가를 적어주세요."
              required
            />
            <div className="typo-body-medium ml-[8px]">원</div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-[13px]">
          <div className="typo-subtitle-small-medium">
            경매 종료 일자<span className="text-main">*</span>
          </div>
          <div className="flex w-full gap-[16px]">
            <div className="flex w-[calc(50%-8px)] flex-col">
              <div className="typo-caption-regular mb-[6px]">종료 날짜</div>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="flex w-[calc(50%-8px)] flex-col">
              <div className="typo-caption-regular mb-[6px]">종료 시간</div>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          variant={isSubmitting ? 'loading' : 'default'}
          disabled={isSubmitting}
        >
          {isSubmitting ? '수정 중...' : '수정하기'}
        </Button>
      </div>
    </div>
  );
};

export default ProductEditPage;
