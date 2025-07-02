import { getProductList } from '@/features/tempProduct/api/getProductList';
import { ProductForList } from '@/features/tempProduct/types';
import { useQuery } from '@tanstack/react-query';

interface UseProductListParams {
  userId: string;
  search?: string;
  cate?: string;
}

export const useProductList = (params: UseProductListParams) => {
  return useQuery<ProductForList[]>({
    queryKey: ['productList', params.userId, params.search, params.cate],
    queryFn: () => getProductList(params),
    enabled: !!params.userId,
    staleTime: 1000 * 60 * 1,
  });
};
