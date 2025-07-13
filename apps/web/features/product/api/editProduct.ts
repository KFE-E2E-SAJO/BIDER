import { ProductForEdit } from '@/entities/product/model/types';
import { ProductEditResponse } from '../types';

export const fetchProductForEdit = async (shortId: string): Promise<ProductForEdit> => {
  const response = await fetch(`/api/product/edit/${shortId}`);

  if (!response.ok) {
    throw new Error('상품 정보를 가져올 수 없습니다.');
  }

  return response.json();
};

export const updateProduct = async (
  shortId: string,
  formData: FormData
): Promise<ProductEditResponse> => {
  const response = await fetch(`/api/product/edit/${shortId}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || '수정 실패');
  }

  return { success: true };
};
