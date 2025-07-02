import { ProductForList } from '@/features/tempProduct/types';

interface GetProductListParams {
  userId: string;
  search?: string;
  cate?: string;
}

export const getProductList = async (params: GetProductListParams): Promise<ProductForList[]> => {
  const { userId, search, cate } = params;

  const query = new URLSearchParams({
    userId,
    ...(search ? { search } : {}),
    ...(cate ? { cate } : {}),
  });

  const res = await fetch(`/api/product?${query.toString()}`);
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.error || 'Failed to fetch product list');
  }
  return res.json();
};
