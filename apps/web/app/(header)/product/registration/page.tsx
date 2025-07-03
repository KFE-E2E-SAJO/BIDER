'use client';

import React, { useState } from 'react';
import { Input } from '@repo/ui/components/Input/Input';
import { Textarea } from '@repo/ui/components/Textarea/Textarea';
import { Button } from '@repo/ui/components/Button/Button';
import { useRouter } from 'next/navigation';
import ImageUploadPreview, { UploadedImage } from '@/shared/lib/ImageUploadPreview';
import { categories, CategoryValue } from '@/features/category/types';
import { useAuthStore } from '@/shared/model/authStore';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/components/Select/Select';

const ProductRegistrationPage = () => {
  const router = useRouter();
  const user = useAuthStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatNumberWithCommas = (value: string) => {
    const numeric = value.replace(/\D/g, '');
    if (!numeric) return '';
    return parseInt(numeric, 10).toLocaleString('ko-KR');
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numericOnly = raw.replace(/\D/g, '');
    const formatted = formatNumberWithCommas(numericOnly);
    setMinPrice(formatted);
  };

  const handleSubmit = async () => {
    if (!title || !description || !minPrice || !endDate || !endTime || images.length === 0) {
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
    formData.append('end_at', endAt.toISOString());
    formData.append('category', category);
    if (user.user?.id) {
      formData.append('user_id', user.user.id);
    }

    images.forEach((img) => {
      if (img.file) {
        formData.append('images', img.file);
      }
    });

    try {
      const res = await fetch('/api/product', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        alert(`출품 실패: ${error}`);
        return;
      }

      alert('출품이 완료되었습니다!');
      setTimeout(() => {
        // 마이페이지 등록한 상품내역 화면으로 이동 예정(아직 미구현됨)
        router.push('/');
      }, 0);
    } catch (err) {
      console.error('출품 에러', err);
      alert('알 수 없는 오류가 발생했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[26px] pt-[16px]">
      <div className="p-box flex flex-col gap-[26px]">
        {/* 사진 업로드 */}
        <ImageUploadPreview exImages={[]} onImagesChange={setImages} />
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
            <div className="flex w-[calc(50%-8px)] flex-1 basis-[0] flex-col">
              <div className="typo-caption-regular mb-[6px]">종료 날짜</div>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="flex w-[calc(50%-8px)] flex-1 basis-[0] flex-col">
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
          {isSubmitting ? '출품 중...' : '출품하기'}
        </Button>
      </div>
    </div>
  );
};

export default ProductRegistrationPage;
