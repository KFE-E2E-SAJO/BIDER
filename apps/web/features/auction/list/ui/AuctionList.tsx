import { AuctionList as AuctionListType } from '@/features/auction/list/types';
import AuctionItem from '@/features/auction/list/ui/AuctionItem';
import Skeleton from '@/features/product/ui/Skeleton';
import { encodeUUID } from '@/shared/lib/shortUuid';
import { VirtualItem } from '@tanstack/react-virtual';
import Link from 'next/link';

interface AuctionListProps {
  data: AuctionListType[];
  virtualRows: VirtualItem[];
  totalSize: number;
  isFetchingNextPage: boolean;
}
const AuctionList = ({ data, virtualRows, totalSize, isFetchingNextPage }: AuctionListProps) => {
  if (data.length === 0) {
    return <p className="mt-10 text-center text-neutral-500">상품이 존재하지 않습니다.</p>;
  }
  return (
    <ul className="relative w-full" style={{ height: `${totalSize}px` }}>
      {virtualRows.map((virtualRow) => {
        const index = virtualRow.index;
        const item = data[index];
        const isLoaderRow = index === data.length;

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
  );
};

export default AuctionList;
