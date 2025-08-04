import { fetchProductForEdit } from '@/features/product/api/editProduct';
import { useQuery } from '@tanstack/react-query';

export const useProductEditQuery = (shortId: string) => {
  return useQuery({
    queryKey: ['product', 'edit', shortId],
    queryFn: () => fetchProductForEdit(shortId),
    staleTime: 1000 * 60 * 5,
  });
};
