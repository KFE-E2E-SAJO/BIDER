import React from 'react';

export default function SystemMessage({ message }: { message: any }) {
  return (
    <div className="my-2 flex w-full justify-start">
      {/* 메시지 카드(왼쪽 세로 초록선 + 흰배경) */}
      <div className="border-alert flex w-fit min-w-[220px] max-w-[80%] flex-col border-l-2 bg-white px-4 py-2">
        {/* 이미지만 먼저 한 줄 */}
        <div className="mb-2 flex w-full justify-start">
          <img
            src={message.product_image_url || '/default-product.png'}
            alt="상품 이미지"
            className="h-[37px] w-[37px] rounded-sm object-cover"
          />
        </div>
        {/* 첫 번째 메시지 */}
        <div className="text-body-medium mb-1 text-left font-bold text-neutral-900">
          축하합니다! 낙찰되었습니다.
        </div>
        {/* 두 번째 메시지 (닉네임, 상품) */}
        <div className="text-body-regular mb-1 text-left text-neutral-900">
          <span className="font-medium">{message.nickname}</span>
          님과&nbsp;
          <span className="font-medium">{message.product_title}</span>에 대한 거래 이야기를
          시작해보세요.
        </div>
        {/* 세 번째 메시지 (낙찰가) */}
        <div className="text-body-regular mt-1 text-left font-light text-neutral-600">
          낙찰 가격 : {Number(message.bid_price).toLocaleString()}원
        </div>
      </div>
    </div>
  );
}
