import { useAuthStore } from '@/shared/model/authStore';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { parseBidPrice, validateBidPrice } from '../lib/utils';
import { submitBid } from '../api/doBid';
import { useMutation } from '@tanstack/react-query';
import { BidResponse, SubmitBidContext } from '../types';
import { useBidStore } from '@/features/auction/bids/model/bidStore';
import { useRouter } from 'next/navigation';

export const useBidSubmit = (shortId: string) => {
  const user = useAuthStore();
  const router = useRouter();
  const { setBidInfo } = useBidStore();
  const mutation = useMutation<BidResponse, Error, string, SubmitBidContext>({
    mutationFn: async (biddingPrice: string) => {
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
      const bidData = result.bidData;
      if (bidData) {
        setBidInfo({
          bidId: bidData.bid_id,
          title: bidData.product_title,
          bid_end_at: bidData.bid_end_at,
          bid_price: bidData.bid_price,
        });
      }
      toast({ content: result.message || '입찰이 완료되었습니다!' });
      context?.onSuccess?.();
      router.push('/bid/complete');
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
      toast({ content: errorMessage });
    },
  });

  const onSubmitBid = (biddingPrice: string) => {
    mutation.mutate(biddingPrice);
  };

  return {
    onSubmitBid,
    isSubmitting: mutation.isPending,
  };
};
