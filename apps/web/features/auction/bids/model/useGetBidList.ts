import { ProductList } from '@/features/product/types';
import { useQuery } from '@tanstack/react-query';
import getBidList from '@/features/auction/bids/model/getBidList';
import { BidListParams } from '@/features/auction/bids/types';

export const useGetBidList = (params: BidListParams) => {
  return useQuery<ProductList[]>({
    queryKey: ['bidList', params.userId, params.filter],
    queryFn: () => getBidList(params),
    enabled: !!params.userId,
    staleTime: 1000 * 60 * 1,
  });
};
