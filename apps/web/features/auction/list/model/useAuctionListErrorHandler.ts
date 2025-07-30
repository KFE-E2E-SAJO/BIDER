import { toast } from '@repo/ui/components/Toast/Sonner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuctionListError } from '@/features/auction/list/types';

const useAuctionListErrorHandler = (isError: boolean, error: AuctionListError | null) => {
  const router = useRouter();

  useEffect(() => {
    if (!isError) return;

    const { code, message } = error!;

    if (code === 'NO_USER_ID') {
      toast({ content: message });
      router.replace('/login');
    } else if (code === 'NO_USER_LOCATION') {
      toast({ content: message });
      router.replace('/set-location');
    } else {
      toast({ content: message || '알 수 없는 오류가 발생했습니다.' });
      router.replace('/login');
    }
  }, [isError]);
};

export default useAuctionListErrorHandler;
