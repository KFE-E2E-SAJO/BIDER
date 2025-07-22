import { useQuery } from '@tanstack/react-query';
import { fetchProductForEdit } from '../api/editProduct';

export const useProductEditQuery = (shortId: string) => {
  return useQuery({
    queryKey: ['product', 'edit', shortId],
    queryFn: () => fetchProductForEdit(shortId),
    staleTime: 1000 * 60 * 5,
  });
};
