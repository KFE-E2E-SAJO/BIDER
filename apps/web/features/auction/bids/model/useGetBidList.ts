import { ProductList } from '@/features/product/types';
import { useQuery } from '@tanstack/react-query';
import getBidList from '@/features/auction/bids/model/getBidList';

interface useGetBidListParams {
  userId: string;
  filter: 'all' | 'progress' | 'win' | 'fail';
}

export const useGetBidList = (params: useGetBidListParams) => {
  return useQuery<ProductList[]>({
    queryKey: ['BidList', params.userId, params.filter],
    queryFn: () => getBidList(params),
    enabled: !!params.userId,
    staleTime: 1000 * 60 * 1,
  });
};
