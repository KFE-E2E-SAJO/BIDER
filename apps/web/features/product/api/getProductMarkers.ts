import { ProductMapList } from '@/features/product/types';

export const getProductMarkers = async (userId: string): Promise<ProductMapList[]> => {
  const res = await fetch(`/api/product-map?userId=${userId}`);

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || '상품 위치 조회 실패');
  }

  const data = await res.json();
  return data;
};
