import { systemMessage } from '@/entities/systemMessage/model/types';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import Image from 'next/image';
import React from 'react';

const data: systemMessage = {
  system_message_id: 'string',
  chatroom_id: 'string',
  product_image_url:
    'https://nrxemenkpeejarhejbbk.supabase.co/storage/v1/object/public/product-image/products/036c7ce8-5cea-4c7f-b32d-e503c0c15d8f.png',
  nickname: '입찰매니아',
  created_at: '2025-07-30 05:19:40.114422+00',
  product_title: '테스트',
  bid_price: 50000,
};

const BidWinMessage = () => {
  return (
    <div className="border-alert flex flex-col gap-[6px] border-l-[2px] pl-[15px] text-left">
      <div className="relative size-[37px] overflow-hidden rounded">
        <Image
          src={data.product_image_url}
          alt="상품 사진"
          fill
          sizes="37"
          className="object-cover object-center"
        />
      </div>
      <div className="typo-body-medium">축하합니다! 낙찰되었습니다.</div>
      <div>
        {data.nickname}님과 {data.product_title}에 대한
        <br />
        거래 이야기를 시작해보세요.
      </div>
      <div className="text-neutral-600">낙찰 가격 : {formatNumberWithComma(data.bid_price)}원</div>
    </div>
  );
};

export default BidWinMessage;
