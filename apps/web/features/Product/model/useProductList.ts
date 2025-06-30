import { getProductList } from '@/features/Product/api/getProductList';
import { Product } from '@/features/Product/types';
import { useQuery } from '@tanstack/react-query';

interface UseProductListParams {
  lat: number;
  lng: number;
  search?: string;
  cate?: string;
}

export const useProductList = (params: UseProductListParams) => {
  return useQuery<Product[]>({
    queryKey: ['productList', params.lat, params.lng, params.search, params.cate],
    queryFn: () => getProductList(params),
    staleTime: 1000 * 60 * 1,
  });
};
