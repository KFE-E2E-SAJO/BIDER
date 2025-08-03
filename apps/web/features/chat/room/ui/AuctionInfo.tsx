'use client';

import StatusBadge from '@/shared/ui/badge/StatusBadge';
import Image from 'next/image';
import React from 'react';
import BackBtn from '@/shared/ui/button/BackBtn';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { AuctionInfoData } from '../types';

interface AuctionInfoProps {
  data: AuctionInfoData;
}

const AuctionInfo = ({ data }: AuctionInfoProps) => {
  const nickname = data.yourNickName;

  return (
    <div className="bg-neutral-0 w-full">
      <div className="p-box flex w-full items-center pb-[10px] pt-[30px]">
        <BackBtn />
        <span className="typo-body-medium pl-[20px]">{nickname}</span>
      </div>
      <div className="flex items-center justify-between border-b border-t border-neutral-100 px-[23px] py-[13px]">
        <div className="flex items-center">
          <div className="relative size-[37px] overflow-hidden rounded">
            <Image
              src={data.image}
              alt="상품 사진"
              fill
              sizes="37"
              className="object-cover object-center"
            />
          </div>
          <div className="ml-[10px]">
            <div className="typo-caption-regular text-neutral-700">{data.title}</div>
            <div className="typo-caption-medium">{`${formatNumberWithComma(data.price)}원`}</div>
          </div>
        </div>
        <StatusBadge
          type={data.status === '경매 종료' ? 'state-lightgray' : 'state-blue'}
          label={data.status}
        />
      </div>
    </div>
  );
};

export default AuctionInfo;
