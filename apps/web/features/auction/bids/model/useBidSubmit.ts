import { useAuthStore } from '@/shared/model/authStore';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { parseBidPrice, validateBidPrice } from '../lib/utils';
import { submitBid } from '../api/doBid';
import { useMutation } from '@tanstack/react-query';
import { BidResponse, SubmitBidContext } from '../types';

export const useBidSubmit = (shortId: string) => {
  const user = useAuthStore();
  const mutation = useMutation<BidResponse, Error, string, SubmitBidContext>({
    mutationFn: (biddingPrice: string) => {
      const bidPriceNumber = parseBidPrice(biddingPrice);

      if (!validateBidPrice(biddingPrice)) {
        throw new Error('올바른 입찰가를 입력해주세요.');
      }

      if (!user.user?.id) {
        throw new Error('로그인이 필요합니다.');
      }

      return submitBid(shortId, {
        bidPrice: bidPriceNumber,
        userId: user.user.id,
      });
    },
    onSuccess: (result, _, context) => {
      toast({ content: result.message || '입찰이 완료되었습니다!' });
      context?.onSuccess?.();
      window.location.reload();
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
      toast({ content: errorMessage });
    },
  });

  const onSubmitBid = (biddingPrice: string, onSuccess?: () => void) => {
    mutation.mutate(biddingPrice, {
      onSuccess: (result) => {
        toast({ content: result.message || '입찰이 완료되었습니다!' });
        onSuccess?.();
        window.location.reload();
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
        toast({ content: errorMessage });
      },
    });
  };

  return {
    onSubmitBid,
    isSubmitting: mutation.isPending,
  };
};
