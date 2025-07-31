import React from 'react';
import { DateDivider } from './DateDivider';
import MyMessage from './MyMessage';
import YourMessage from './YourMessage';

const MessageList = () => {
  return (
    <div>
      <DateDivider isoDate={'2025-06-17T09:32:00.000Z'} />
      <MyMessage
        text={'안녕하세요! 제품 상태에 대해 더 자세히 알 수 있을까요?'}
        showTime={true}
        isRead={true}
        isLast={false}
      />
      <YourMessage
        className="mt-[20px]"
        text={'새 상품입니다~!'}
        showTime={false}
        showAvatar={true}
      />
      <YourMessage
        className="mt-[10px]"
        text={'개봉도 안 했어요ㅎㅎ'}
        showTime={true}
        showAvatar={false}
      />
      <MyMessage
        className="mt-[20px]"
        text={'넵 감사합니다~'}
        showTime={true}
        isRead={true}
        isLast={true}
      />
    </div>
  );
};

export default MessageList;
