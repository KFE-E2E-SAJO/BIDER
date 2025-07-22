import { getProductList } from '@/features/product/api/getProductList';
import { ProductList, ProductListError, ProductListParams } from '@/features/product/types';
import { useInfiniteQuery } from '@tanstack/react-query';

interface ProductListResponse {
  data: ProductList[];
  nextOffset: number;
}

export const useProductList = (params: ProductListParams) => {
  return useInfiniteQuery<ProductListResponse, ProductListError>({
    queryKey: ['productList', params],
    queryFn: ({ pageParam = 0 }) =>
      getProductList({ limit: 5, offset: pageParam as number, params }),
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 1,
    retry: 2,
  });
};
