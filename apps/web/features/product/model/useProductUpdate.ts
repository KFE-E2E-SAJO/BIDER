import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../api/editProduct';

export const useProductUpdateMutation = (shortId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => updateProduct(shortId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', 'edit', shortId] });
    },
  });
};
