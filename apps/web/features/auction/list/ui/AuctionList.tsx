import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { useAuctionList } from '@/features/auction/list/model/useAuctionList';
import useAuctionListErrorHandler from '@/features/auction/list/model/useAuctionListErrorHandler';
import useVirtualInfiniteScroll from '@/features/auction/list/model/useVirtualInfiniteScroll';
import { AuctionFilter, AuctionSort } from '@/features/auction/list/types';
import AuctionItem from '@/features/auction/list/ui/AuctionItem';
import { CategoryValue } from '@/features/category/types';
import Skeleton from '@/features/product/ui/Skeleton';
import { encodeUUID } from '@/shared/lib/shortUuid';
import Loading from '@/shared/ui/Loading/Loading';
import Link from 'next/link';

interface AuctionListProps {
  sort?: AuctionSort;
  filter?: AuctionFilter[];
  cate?: CategoryValue;
  listOnly?: boolean;
  search?: string;
}

const AuctionList = ({
  sort = DEFAULT_AUCTION_LIST_PARAMS.sort,
  filter = DEFAULT_AUCTION_LIST_PARAMS.filter,
  cate = DEFAULT_AUCTION_LIST_PARAMS.cate,
  search = DEFAULT_AUCTION_LIST_PARAMS.search,
  listOnly = true,
}: AuctionListProps) => {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAuctionList({ params: { sort, filter, cate, search } });
  useAuctionListErrorHandler(isError, error);
  const auctionList = data?.pages.flatMap((page) => page.data) ?? [];

  const { parentRef, virtualRows, totalSize } = useVirtualInfiniteScroll({
    data: auctionList,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });
  if (isLoading) {
    return <Loading />;
  }

  if (auctionList.length === 0) {
    return <p className="mt-10 text-center text-neutral-500">상품이 존재하지 않습니다.</p>;
  }
  return (
    <div
      ref={parentRef}
      style={{ height: listOnly ? 'calc(100vh - 235px)' : 'calc(100vh - 535px)' }}
      className="p-box overflow-auto"
    >
      <ul className="relative w-full" style={{ height: `${totalSize}px` }}>
        {virtualRows.map((virtualRow) => {
          const index = virtualRow.index;
          const item = auctionList[index];
          const isLoaderRow = index === auctionList.length;

          return (
            <li
              key={virtualRow.key}
              className={`absolute left-0 top-0 w-full border-b border-neutral-100 py-[20px] ${
                virtualRow.index === 0 ? 'pt-0' : ''
              }`}
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow && isFetchingNextPage && <Skeleton />}

              {item && (
                <Link href={`/auction/${encodeUUID(item.id)}`}>
                  <AuctionItem {...item} />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AuctionList;
