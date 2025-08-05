import React from 'react';
import { MessageProps } from '../types';
import clsx from 'clsx';
import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { formatKoreanTime } from '../lib/utils';

const YourMessage = ({ text, showTime, showAvatar, className, time, avatar }: MessageProps) => {
  return (
    <div className={clsx('flex items-end', className)}>
      {showAvatar ? (
        <Avatar className="mr-[10px] size-[29px]" src={avatar} />
      ) : (
        <div className="ml-[39px]"></div>
      )}
      <div className="max-w-[65vw] rounded-[10px] bg-neutral-100 px-[10px] py-[6px] text-neutral-800">
        {text}
      </div>
      {showTime && (
        <div className="typo-caption-regular ml-[8px] text-neutral-400">
          {formatKoreanTime(time)}
        </div>
      )}
    </div>
  );
};

export default YourMessage;
