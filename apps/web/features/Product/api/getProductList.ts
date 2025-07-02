import { ProductForList } from '@/features/product/types';

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
  if (!res.ok) throw new Error('Failed to fetch product list');
  return res.json();
};
