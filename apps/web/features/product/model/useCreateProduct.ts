import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { CreateProductRequest, CreateProductResponse, productKeys } from '../types';
import { createProduct } from '../api/createProduct';

interface UseCreateProductOptions {
  onSuccess?: (data: CreateProductResponse) => void;
  onError?: (error: Error) => void;
}

export const useCreateProduct = (options?: UseCreateProductOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: (data) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });

      toast({ content: '출품이 완료되었습니다!' });

      // 성공 후 페이지 이동
      setTimeout(() => {
        router.push('/auction/listings');
      }, 0);

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('출품 에러:', error);
      toast({ content: error.message || '출품 실패' });

      options?.onError?.(error);
    },
  });
};

// 폼 검증과 함께 사용하는 hook
export const useCreateProductWithValidation = (options?: UseCreateProductOptions) => {
  const createProduct = useCreateProduct(options);

  const createProductWithValidation = (data: CreateProductRequest) => {
    // 기본 검증
    if (
      !data.title.trim() ||
      !data.category ||
      !data.description.trim() ||
      !data.minPrice ||
      !data.endDate ||
      !data.endTime ||
      data.images.length === 0
    ) {
      toast({ content: '모든 필수 항목을 입력해 주세요' });
      return;
    }

    if (data.dealLatitude && !data.dealAddress) {
      toast({ content: '위치 설명을 작성해 주세요.' });
      return;
    }

    if (!data.userId) {
      toast({ content: '로그인이 필요합니다.' });
      return;
    }

    createProduct.mutate(data);
  };

  return {
    ...createProduct,
    mutate: createProductWithValidation,
  };
};
