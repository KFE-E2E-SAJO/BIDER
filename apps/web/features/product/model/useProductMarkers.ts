import { useQuery } from '@tanstack/react-query';
import { getProductMarkers } from '@/features/product/api/getProductMarkers';
import { ProductMapList } from '@/features/product/types';

export const useProductMarkers = (userId: string) => {
  return useQuery<ProductMapList[]>({
    queryKey: ['productMarkers', userId],
    queryFn: () => getProductMarkers(userId),
    enabled: !!userId,
  });
};
