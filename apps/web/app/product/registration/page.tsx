'use client';

import React, { useState } from 'react';
import ImageUploadPreview from './ImageUploadPreview';
import { InputContent } from '@repo/ui/components/Input/Input';
import { Textarea } from '@repo/ui/components/Textarea/Textarea';
import { Button } from '@repo/ui/components/Button/Button';

const ProductRegistrationPage = () => {
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  return (
    <div className="flex flex-col gap-[26px] pt-10">
      {/* 사진 업로드 */}
      <ImageUploadPreview />
      <div className="flex flex-col gap-[13px]">
        <div className="typo-subtitle-small-medium">
          상품 제목<span className="text-main">*</span>
        </div>
        <InputContent placeholder="상품 제목을 입력해 주세요." required />
      </div>
      <div className="flex flex-col gap-[13px]">
        <div className="typo-subtitle-small-medium">
          자세한 설명<span className="text-main">*</span>
        </div>
        <Textarea
          className="h-[204px]"
          placeholder="상품의 상태, 구매 시기, 사용감 등을 자세히 설명해 주세요."
          required
        />
      </div>
      <div className="h-[8px] w-full bg-neutral-100"></div>
      <div className="flex flex-col gap-[13px]">
        <div className="typo-subtitle-small-medium">
          입찰 시작가<span className="text-main">*</span>
        </div>
        <div className="flex items-end">
          <InputContent placeholder="희망하는 최소 입찰가를 적어주세요." required />
          <div className="typo-body-medium ml-[8px]">원</div>
        </div>
      </div>
      <div className="flex flex-col gap-[13px]">
        <div className="typo-subtitle-small-medium">
          경매 종료 일자<span className="text-main">*</span>
        </div>
        <div className="flex w-full gap-[16px]">
          <div className="flex flex-1 basis-[0] flex-col">
            <div className="typo-caption-regular mb-[6px]">종료 날짜</div>
            <InputContent
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-1 basis-[0] flex-col">
            <div className="typo-caption-regular mb-[6px]">종료 시간</div>
            <InputContent
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <Button>출품하기</Button>
    </div>
  );
};

export default ProductRegistrationPage;
