import { ProductList } from '@/features/product/types';
import { useQuery } from '@tanstack/react-query';
import getListingList from '@/features/auction/listings/model/getListingList';

interface useGetListingListParams {
  userId: string;
  filter: 'all' | 'pending' | 'progress' | 'win' | 'fail';
}

export const useGetListingList = (params: useGetListingListParams) => {
  return useQuery<ProductList[]>({
    queryKey: ['ListingList', params.userId, params.filter],
    queryFn: () => getListingList(params),
    enabled: !!params.userId,
    staleTime: 0,
  });
};
