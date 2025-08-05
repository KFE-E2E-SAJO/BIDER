import { SystemMessageWithNickname } from '@/entities/systemMessage/model/types';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { useAuthStore } from '@/shared/model/authStore';
import Image from 'next/image';
import React from 'react';

type BidWinMessageProps = {
  data: SystemMessageWithNickname;
};

const BidWinMessage = ({ data }: BidWinMessageProps) => {
  const userId = useAuthStore((state) => state.user?.id) as string;
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
        {userId === data.bid_user_id ? data.exhibit_user_nickname : data.bid_user_nickname}님과{' '}
        {data.product_title}에 대한
        <br />
        거래 이야기를 시작해보세요.
      </div>
      <div className="text-neutral-600">낙찰 가격 : {formatNumberWithComma(data.bid_price)}원</div>
    </div>
  );
};

export default BidWinMessage;
