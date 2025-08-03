import React from 'react';
import { MessageProps } from '../types';
import clsx from 'clsx';
import { formatKoreanTime } from '../lib/utils';

const MyMessage = ({ text, showTime, isRead, isLast, className, time }: MessageProps) => {
  return (
    <div className={clsx('flex items-end justify-end gap-[8px]', className)}>
      <div className="flex translate-y-[5px] flex-col justify-end text-right">
        {isLast && isRead ? (
          <div className="typo-caption-regular translate-y-[2px] text-neutral-400">읽음</div>
        ) : (
          <></>
        )}
        {showTime && (
          <div className="typo-caption-regular text-neutral-400">{formatKoreanTime(time)}</div>
        )}
      </div>
      <div className="bg-main text-neutral-0 max-w-[65vw] rounded-[10px] px-[10px] py-[6px]">
        {text}
      </div>
    </div>
  );
};

export default MyMessage;
