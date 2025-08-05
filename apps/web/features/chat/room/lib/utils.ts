import { MessageWithProfile } from '@/entities/message/model/types';
import { CombinedMessage } from '../types';

export const formatKoreanTime = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const isAM = hours < 12;
  const period = isAM ? '오전' : '오후';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return minutes === 0 ? `${period} ${hour12}시` : `${period} ${hour12}시 ${minutes}분`;
};

export const isUserMessage = (
  msg: CombinedMessage | undefined
): msg is MessageWithProfile & { messageType: 'user' } => {
  return msg?.messageType === 'user';
};
