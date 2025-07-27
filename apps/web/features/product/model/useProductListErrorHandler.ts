import { toast } from '@repo/ui/components/Toast/Sonner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductListError } from '@/features/product/types';

const useProductListErrorHandler = (isError: boolean, error: ProductListError | null) => {
  const router = useRouter();

  useEffect(() => {
    if (!isError) return;

    const { code, message } = error!;

    if (code === 'NO_USER_ID') {
      toast({ content: message });
    } else if (code === 'NO_USER_LOCATION') {
      toast({ content: message });
    } else {
      toast({ content: message || '알 수 없는 오류가 발생했습니다.' });
      router.replace('/login');
    }
  }, [isError]);
};

export default useProductListErrorHandler;
