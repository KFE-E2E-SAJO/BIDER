'use client';

import React, { useState } from 'react';
import { Input } from '@repo/ui/components/Input/Input';
import { Textarea } from '@repo/ui/components/Textarea/Textarea';
import { Button } from '@repo/ui/components/Button/Button';
import { useRouter } from 'next/navigation';
import ImageUploadPreview from '@/shared/lib/ImageUploadPreview';
import { categories, CategoryValue } from '@/features/category/types';
import { useAuthStore } from '@/shared/model/authStore';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/components/Select/Select';
import { formatPriceInput, isEndDateValid } from '../lib/utils';
import { useCreateProductWithValidation } from '../model/useCreateProduct';
import { useProductFormWithoutSubmitting } from '../model/useProductForm';
import GoogleMap from '@/features/location/ui/GooggleMap';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { Switch } from '@repo/ui/components/Switch/Switch';
import { Location } from '@/features/location/types';
import { Info } from 'lucide-react';

export const ProductRegistrationForm = () => {
  const router = useRouter();
  const user = useAuthStore();

  const {
    // State
    title,
    category,
    description,
    dealAddress,
    dealLatitude,
    dealLongitude,
    minPrice,
    endDate,
    endTime,
    images,
    // Actions
    setTitle,
    setCategory,
    setDescription,
    setDealAddress,
    setDealLatitude,
    setDealLongitude,
    setMinPrice,
    setEndDate,
    setEndTime,
    setImages,
    reset,
  } = useProductFormWithoutSubmitting();

  const createProduct = useCreateProductWithValidation({
    onSuccess: () => {
      // 성공 시 폼 리셋
      reset();
      router.push('/auction/listings');
    },
  });

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPriceInput(e.target.value);
    setMinPrice(formatted);
  };

  const handleSubmit = () => {
    if (!user.user?.id) {
      return;
    }

    if (!isEndDateValid(endDate, endTime)) {
      toast({ content: '종료일시는 현재 시간 기준 1시간 이후여야 합니다.' });
      return;
    }

    createProduct.mutate({
      title,
      category,
      description,
      dealAddress: dealLocationUse ? dealAddress : undefined,
      dealLatitude: dealLocationUse ? Number(dealLatitude) : undefined,
      dealLongitude: dealLocationUse ? Number(dealLongitude) : undefined,
      minPrice,
      endDate,
      endTime,
      images,
      userId: user.user.id,
    });
  };

  const isSubmitting = createProduct.isPending;

  const [dealLocationUse, setDealLocationUse] = useState(false);

  return (
    <div className="flex flex-col gap-[26px]">
      <div className="p-box flex flex-col gap-[26px]">
        {/* 사진 업로드 */}
        <ImageUploadPreview exImages={[]} onImagesChange={setImages} />

        {/* 상품 제목 */}
        <div className="flex flex-col gap-[10px]">
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
        <div className="flex flex-col gap-[10px]">
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

        {/* 상품 설명 */}
        <div className="flex flex-col gap-[10px]">
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

        {/* 거래 희망 장소 */}
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center justify-between">
            <div className="typo-subtitle-small-medium">거래 희망 장소</div>
            <Switch checked={dealLocationUse} onCheckedChange={setDealLocationUse} />
          </div>
          {dealLocationUse && (
            <div className="flex flex-col gap-[10px]">
              <div className="typo-caption-regular text-neutral-700">
                *지도의 핀을 이동해주시고, 입력창에 상세 주소를 입력해주세요.
              </div>
              <GoogleMap
                setLocation={(loc: Location) => {
                  setDealLatitude(loc.lat.toString());
                  setDealLongitude(loc.lng.toString());
                }}
                setAddress={setDealAddress}
                draggable={true}
                mapId="product-registration"
                height="h-[300px]"
              />
              <Input
                placeholder="위치 추가"
                value={dealAddress}
                onChange={(e) => setDealAddress(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="h-[8px] w-full bg-neutral-100"></div>

      <div className="p-box flex flex-col gap-[26px]">
        {/* 입찰 시작가 */}
        <div className="flex flex-col gap-[10px]">
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

        {/* 경매 종료 일자 */}
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

        {/* 제출 버튼 */}
        <Button
          onClick={handleSubmit}
          variant={isSubmitting ? 'loading' : 'default'}
          disabled={isSubmitting}
        >
          {isSubmitting ? '출품 중...' : '출품하기'}
        </Button>

        <div className="bg-warning-light text-warning-medium typo-caption-medium rounded-[3px] p-[14px]">
          <div className="flex items-center">
            <Info strokeWidth={2} size={14} />
            <span className="pl-1">출품 전 안내사항</span>
          </div>
          <ul className="list-disc pl-[30px]">
            <li>상품을 출품하면 1시간 동안 ‘경매 대기’ 상태로 유지됩니다.</li>
            <li>
              이 기간 동안에는 상품 목록에 노출되지 않으며, 내 경매 &gt; 출품 내역 페이지에서만
              확인할 수 있습니다.
            </li>
            <li>‘경매 대기’ 상태에서는 상품 정보를 자유롭게 수정하거나 삭제할 수 있습니다.</li>
            <li>
              1시간이 지나면 경매가 시작되며, 이후에는 수정 및 삭제가 불가능하니 주의해 주세요.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
