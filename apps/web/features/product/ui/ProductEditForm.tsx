'use client';

import React from 'react';
import { Input } from '@repo/ui/components/Input/Input';
import { Textarea } from '@repo/ui/components/Textarea/Textarea';
import { Button } from '@repo/ui/components/Button/Button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/components/Select/Select';
import { categories, CategoryValue } from '@/features/category/types';
import ImageUploadPreview from '@/shared/lib/ImageUploadPreview';
import Loading from '@/shared/ui/Loading/Loading';
import { useProductEdit } from '../model/useProductEdit';

interface ProductEditFormProps {
  shortId: string;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({ shortId }) => {
  const {
    data,
    loading,
    error,
    isSubmitting,
    mappedImages,
    title,
    category,
    description,
    minPrice,
    images,
    endDate,
    endTime,
    setTitle,
    setCategory,
    setDescription,
    setImages,
    setEndDate,
    setEndTime,
    handleMinPriceUpdate,
    handleSubmit,
  } = useProductEdit(shortId);

  if (loading) return <Loading />;
  if (error) return <p>오류: {error}</p>;
  if (!data) return <p>상품 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="flex flex-col gap-[26px] pt-[16px]">
      <div className="p-box flex flex-col gap-[26px]">
        {/* 사진 업로드 */}
        <ImageUploadPreview exImages={mappedImages} onImagesChange={setImages} />

        {/* 제목 */}
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

        {/* 카테고리 */}
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

        {/* 설명 */}
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
        {/* 시작가 */}
        <div className="flex flex-col gap-[13px]">
          <div className="typo-subtitle-small-medium">
            입찰 시작가<span className="text-main">*</span>
          </div>
          <div className="flex items-end">
            <Input
              value={minPrice}
              onChange={handleMinPriceUpdate}
              placeholder="희망하는 최소 입찰가를 적어주세요."
              required
            />
            <div className="typo-body-medium ml-[8px]">원</div>
          </div>
        </div>

        {/* 종료 일시 */}
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
