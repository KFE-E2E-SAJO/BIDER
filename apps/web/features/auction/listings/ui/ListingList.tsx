'use client';

import ProductList from '@/features/product/ui/ProductList';
import { useGetListingList } from '@/features/auction/listings/model/useGetListingList';
import Loading from '@/shared/ui/Loading/Loading';

export interface ListingListProps {
  filter: 'all' | 'pending' | 'progress' | 'win' | 'fail';
  userId: string;
}

const ListingList = ({ filter, userId }: ListingListProps) => {
  const { data, isLoading, error } = useGetListingList({ userId, filter });
  if (isLoading || error || !data) return <Loading />;

  return (
    <div className="flex flex-col gap-4 px-4">
      <ProductList data={data} />
    </div>
  );
};

export default ListingList;
