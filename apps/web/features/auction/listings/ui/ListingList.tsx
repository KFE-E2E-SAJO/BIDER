import ProductList from '@/features/product/ui/ProductList';
import getListingList from '../model/getListingList';

interface ListingListProps {
  filter: 'all' | 'pending' | 'progress' | 'win' | 'fail';
}

const ListingList = async ({ filter }: ListingListProps) => {
  const data = await getListingList(filter);

  if (!data) return <div>출품 내역을 불러오는 중 오류가 발생했어요.</div>;

  return (
    <div className="flex flex-col gap-4 px-4">
      <ProductList data={data} />
    </div>
  );
};

export default ListingList;
