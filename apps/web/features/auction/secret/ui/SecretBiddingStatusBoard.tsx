import { BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';
import BiddingStatusBoard from '@/features/auction/detail/ui/BiddingStatusBoard';
import { checkSecretBoard } from '@/features/auction/secret/model/checkSecretBoard';
import { useSecretDialog } from '@/features/auction/secret/model/useSecretDialog';
import { Button } from '@repo/ui/components/Button/Button';
import { throttle } from 'lodash';
import { Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface SecretBidStatusBoardProps {
  auctionId: string;
  auctionEndAt: string;
  bidCnt: number;
  isSecret: boolean;
  onNewHighestBid: (newPrice: number) => void;
}

const SecretBidStatusBoard = ({
  auctionId,
  auctionEndAt,
  bidCnt,
  isSecret,
  onNewHighestBid,
}: SecretBidStatusBoardProps) => {
  const [showHighestBid, setShowHighestBid] = useState(false);
  const [bidHistory, setBidHistory] = useState<BidHistoryWithUserNickname[] | null>(null);

  const { DialogHost, alertTimeLimit, alertNotEnoughPoint, confirmSpendPoints, openSecretGuide } =
    useSecretDialog();

  const handleCheck = async () => {
    const history = await checkSecretBoard({
      auctionId,
      auctionEndAt,
      bidCnt,
      ui: { alertTimeLimit, alertNotEnoughPoint, confirmSpendPoints },
    });
    if (history) {
      setBidHistory(history);
      setShowHighestBid(true);
    }
  };

  // throttle: 의존값 바뀌면 새 핸들러 생성
  const handleCheckThrottled = useMemo(
    () => throttle(handleCheck, 2000, { trailing: false }),
    [auctionId, auctionEndAt, bidCnt]
  );

  // 언마운트 시 throttle 취소(메모리 누수/의도치 호출 방지)
  useEffect(() => {
    return () => handleCheckThrottled.cancel();
  }, [handleCheckThrottled]);

  return (
    <div className="p-box">
      <div className="flex items-center justify-between">
        <div className="typo-subtitle-small-medium">입찰 현황판</div>
        {showHighestBid && (
          <p className="typo-caption-regular text-neutral-600">10분간 확인 가능합니다</p>
        )}
      </div>
      {showHighestBid ? (
        bidHistory && (
          <div className="mt-[14px]">
            <BiddingStatusBoard
              data={bidHistory}
              auctionId={auctionId}
              onNewHighestBid={onNewHighestBid}
              isSecret={isSecret}
            />
          </div>
        )
      ) : (
        <>
          <p className="typo-caption-regular mt-[7px] flex items-center gap-[3px] text-neutral-600">
            <span>500포인트로 최고 입찰가를 확인할 수 있어요</span>
            <button onClick={() => openSecretGuide()}>
              <Info className="strock-event size-[13px]" />
            </button>
          </p>
          <Button
            className="bg-event-light typo-body-medium text-event mt-[20px]"
            onClick={handleCheckThrottled}
          >
            최고 입찰가 확인하기
          </Button>
          <p className="typo-body-regular mt-[7px] text-center">
            <span className="typo-body-medium text-event">{bidCnt}명</span>이 이 상품에 입찰
            중이에요!
          </p>
        </>
      )}

      <DialogHost />
    </div>
  );
};

export default SecretBidStatusBoard;
