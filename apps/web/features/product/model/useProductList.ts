import { getProductList } from '@/features/product/api/getProductList';
import { ProductList, ProductListError, ProductListParams } from '@/features/product/types';
import { useQuery } from '@tanstack/react-query';

export const useProductList = (params: ProductListParams) => {
  return useQuery<ProductList[], ProductListError>({
    queryKey: ['productList', params],
    queryFn: () => getProductList(params),
    staleTime: 1000 * 60 * 1,
    retry: 2,
  });
};
