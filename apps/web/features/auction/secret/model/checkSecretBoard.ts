'use client';

import { toast } from '@repo/ui/components/Toast/Sonner';
import { isMoreThanOneHour } from '../lib/utils';
import checkSecretViewHistory from '../actions/checkSecretViewHistory';
import getBidHistory from '../actions/getBidHistory';
import { createPointByReason } from '@/features/point/api/createPointByReason';
import { saveSecretViewHistory } from '../actions/saveSecretViewHistory';
import { BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';

export type UIAdapter = {
  alertTimeLimit: () => Promise<void>;
  alertNotEnoughPoint: () => Promise<void>;
  confirmSpendPoints: () => Promise<boolean>;
};

interface CheckSecretBoardProps {
  auctionId: string;
  auctionEndAt: string;
  bidCnt: number;
  ui: UIAdapter;
}

export async function checkSecretBoard({
  auctionId,
  auctionEndAt,
  bidCnt,
  ui,
}: CheckSecretBoardProps): Promise<BidHistoryWithUserNickname[] | null> {
  // 마감 한 시간 이하면 확인불가 모달
  if (!isMoreThanOneHour(auctionEndAt)) {
    await ui.alertTimeLimit();
    return null;
  }
  //아직 아무도 입찰을 안했을 경우
  if (bidCnt <= 0) {
    toast({ content: '첫 번째 입찰자가 되어보세요!' });
    return null;
  }
  // 1. 과거에 확인했는지 검사
  //1-1. 10분 안지났음
  const { hasPaid, isValid } = await checkSecretViewHistory(auctionId);
  if (hasPaid && isValid) {
    return await getBidHistory(auctionId);
  }

  // 2. 유저 포인트 조회 (결제내역없음 혹은 10분지남)
  try {
    const res = await fetch('/api/profile');
    const { point } = await res.json();
    if (Number(point) < 500) {
      await ui.alertNotEnoughPoint();
      return null;
    }
  } catch {
    toast({ content: '포인트 정보를 불러오지 못했어요.' });
    return null;
  }

  //포인트 사용 확인 모달
  const ok = await ui.confirmSpendPoints();
  if (!ok) return null;

  // 3. 히스토리 저장
  const historyResult = await saveSecretViewHistory(auctionId);
  if (!historyResult.success) {
    toast({ content: '입찰 히스토리 저장에 실패했어요. 잠시 후 다시 시도해주세요.' });
    return null;
  }

  // 4. 포인트 차감 요청
  try {
    const pointRes = await createPointByReason('secret_bid_view', 'loginUser');
    if (!pointRes?.success) throw new Error('포인트 차감 실패');
  } catch {
    toast({ content: '포인트 차감에 실패했어요. 잠시 후 다시 시도해주세요.' });
    return null;
  }

  return await getBidHistory(auctionId);
}
