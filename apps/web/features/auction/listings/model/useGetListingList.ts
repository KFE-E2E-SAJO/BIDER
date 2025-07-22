import { ProductList } from '@/features/product/types';
import { useQuery } from '@tanstack/react-query';
import getListingList from '@/features/auction/listings/model/getListingList';
import { ListingListParams } from '../types';

export const useGetListingList = (params: ListingListParams) => {
  return useQuery<ProductList[]>({
    queryKey: ['listingList', params.userId, params.filter],
    queryFn: () => getListingList(params),
    enabled: !!params.userId,
    staleTime: 0,
  });
};
