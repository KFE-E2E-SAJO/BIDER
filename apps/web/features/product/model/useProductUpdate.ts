import { updateProduct } from '@/features/product/api/editProduct';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useProductUpdateMutation = (shortId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => updateProduct(shortId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', 'edit', shortId] });
    },
  });
};
