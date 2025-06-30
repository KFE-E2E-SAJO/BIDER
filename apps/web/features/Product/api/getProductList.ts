import { Product } from '@/features/product/types';

interface GetProductListParams {
  lat: number;
  lng: number;
  search?: string;
  cate?: string;
}

export const getProductList = async (params: GetProductListParams): Promise<Product[]> => {
  const { lat, lng, search, cate } = params;

  const query = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    ...(search ? { search } : {}),
    ...(cate ? { cate } : {}),
  });

  const res = await fetch(`/api/product?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch product list');
  return res.json();
};
