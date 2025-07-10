import { useState } from 'react';
import { useAuthStore } from '@/shared/model/authStore';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { parseBidPrice, validateBidPrice } from '../lib/utils';
import { submitBid } from '../api/doBid';

export const useBidSubmit = (shortId: string) => {
  const user = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitBid = async (biddingPrice: string, onSuccess?: () => void) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const bidPriceNumber = parseBidPrice(biddingPrice);

      if (!validateBidPrice(biddingPrice)) {
        toast({ content: '올바른 입찰가를 입력해주세요.' });
        return;
      }

      if (!user.user?.id) {
        toast({ content: '로그인이 필요합니다.' });
        return;
      }

      const result = await submitBid(shortId, {
        bidPrice: bidPriceNumber,
        userId: user.user.id,
      });

      toast({ content: result.message || '입찰이 완료되었습니다!' });
      onSuccess?.();

      // 페이지 새로고침 또는 데이터 재로드
      window.location.reload();
    } catch (error) {
      console.error('입찰 요청 오류:', error);
      const errorMessage =
        error instanceof Error ? error.message : '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
      toast({ content: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmitBid,
    isSubmitting,
  };
};
