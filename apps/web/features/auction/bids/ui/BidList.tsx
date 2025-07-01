import ProductList from '@/features/product/ui/ProductList';
import { getFilteredBidList } from '../model/getBidList';

interface BidListProps {
  filter: 'all' | 'progress' | 'win' | 'fail';
}

const BidList = async ({ filter }: BidListProps) => {
  const data = await getFilteredBidList(filter);

  if (!data) return <div>입찰 내역을 불러오는 중 오류가 발생했어요.</div>;

  return (
    <div className="flex flex-col gap-4 px-4">
      <ProductList data={data} />
    </div>
  );
};

export default BidList;
