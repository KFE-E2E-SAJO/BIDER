// import { ProductList } from '@/features/product/types';
// import { useQuery } from '@tanstack/react-query';
// import getBidList from '@/features/auction/bids/model/getBidList';

// export interface TargetProductParams {
//   userId: string;
// }

// export const useTargetProduct = (params: TargetProductParams) => {
//   return useQuery<ProductList[]>({
//     queryKey: ['bidList', params.userId],
//     queryFn: () => getBidList(params),
//     enabled: !!params.userId,
//     staleTime: 1000 * 60 * 1,
//   });
// };
