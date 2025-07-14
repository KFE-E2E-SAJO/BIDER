'use client';

import ProductList from '@/features/product/ui/ProductList';
import { useGetBidList } from '@/features/auction/bids/model/useGetBidList';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';
export interface BidListProps {
  filter: 'all' | 'progress' | 'win' | 'fail';
}

const BidList = ({ filter }: BidListProps) => {
  const userId = useAuthStore((state) => state.user?.id) as string;

  const { data, isLoading, error } = useGetBidList({
    userId,
    filter,
  });

  if (isLoading || error || !data) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4 px-4">
      <ProductList data={data} />
    </div>
  );
};

export default BidList;
