import { ProductList, ProductListParams } from '@/features/product/types';

interface getProductListParams {
  limit: number;
  offset: number;
  params: ProductListParams;
}

export const getProductList = async ({
  limit,
  offset = 0,
  params,
}: getProductListParams): Promise<{ data: ProductList[]; nextOffset: number }> => {
  const { userId, search, cate, sort, filter } = params;

  if (!userId) {
    throw {
      message: '로그인이 필요합니다.',
      code: 'NO_USER_ID',
      status: 401,
    };
  }

  const query = new URLSearchParams();

  query.set('userId', userId);
  query.set('limit', limit.toString());
  query.set('offset', offset.toString());
  if (search) query.set('search', search);
  if (cate) query.set('cate', cate);
  if (sort) query.set('sort', sort);
  if (filter && filter.length > 0) {
    filter.forEach((f) => query.append('filter', f));
  }

  const res = await fetch(`/api/product?${query.toString()}`);
  if (!res.ok) {
    const errorBody = await res.json();

    throw {
      message: errorBody.error || '상품 리스트 조회 실패',
      code: errorBody.code || 'UNKNOWN_ERROR',
      status: res.status,
    };
  }

  const result = await res.json();
  return {
    data: result.data,
    nextOffset: result.nextOffset,
  };
};
