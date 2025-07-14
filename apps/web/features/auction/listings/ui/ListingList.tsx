'use client';

import ProductList from '@/features/product/ui/ProductList';
import { useGetListingList } from '@/features/auction/listings/model/useGetListingList';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';
interface ListingListProps {
  filter: 'all' | 'pending' | 'progress' | 'win' | 'fail';
}

const ListingList = ({ filter }: ListingListProps) => {
  const userId = useAuthStore((state) => state.user?.id) as string;

  const { data, isLoading, error } = useGetListingList({
    userId,
    filter,
  });

  if (isLoading || error || !data) return <Loading />;

  return (
    <div className="flex flex-col gap-4 px-4">
      <ProductList data={data} />
    </div>
  );
};

export default ListingList;
