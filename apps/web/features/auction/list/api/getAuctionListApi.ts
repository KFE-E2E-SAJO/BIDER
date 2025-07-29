import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { AuctionList, AuctionListParams } from '@/features/auction/list/types';

interface getAuctionListApiProps {
  limit?: number;
  offset?: number;
  params: AuctionListParams;
}

export const getAuctionListApi = async (
  props: getAuctionListApiProps
): Promise<{ data: AuctionList[]; nextOffset: number }> => {
  const { limit = 5, offset = 0, params = DEFAULT_AUCTION_LIST_PARAMS } = props;
  const { search, cate, sort, filter } = params;

  const query = new URLSearchParams();

  query.set('limit', limit.toString());
  query.set('offset', offset.toString());
  query.set('search', search);
  query.set('cate', cate);
  query.set('sort', sort);
  filter.forEach((f) => query.append('filter', f));

  const res = await fetch(`/api/auction/list?${query.toString()}`);
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
