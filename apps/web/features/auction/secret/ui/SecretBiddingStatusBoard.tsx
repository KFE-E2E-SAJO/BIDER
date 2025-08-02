import { BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';
import BiddingStatusBoard from '@/features/auction/detail/ui/BiddingStatusBoard';
import { checkSecretBoard } from '@/features/auction/secret/model/checkSecretBoard';
import { useSecretDialog } from '@/features/auction/secret/model/useSecretDialog';
import { Button } from '@repo/ui/components/Button/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/Tooltip/Tooltip';
import { throttle } from 'lodash';
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

  const { DialogHost, alertTimeLimit, alertNotEnoughPoint, confirmSpendPoints } = useSecretDialog();

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
      <div className="mb-[14px]">
        <div className="typo-subtitle-small-medium mb-[14px]">입찰 현황판</div>
        <p className="typo-body-regular">
          <span className="typo-body-medium text-event">{bidCnt}명</span>이 이 상품에 입찰 중이에요!
        </p>
      </div>
      {showHighestBid ? (
        bidHistory && (
          <BiddingStatusBoard
            data={bidHistory}
            auctionId={auctionId}
            onNewHighestBid={onNewHighestBid}
            isSecret={isSecret}
          />
        )
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-event-light typo-body-medium text-event"
                onClick={handleCheckThrottled}
              >
                최고 입찰가 확인하기
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end" className="mt-1">
              500포인트로 최고 입찰가를 확인할 수 있어요
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <DialogHost />
    </div>
  );
};

export default SecretBidStatusBoard;
