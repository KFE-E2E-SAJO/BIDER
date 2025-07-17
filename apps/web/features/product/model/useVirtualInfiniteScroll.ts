import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface UseVirtualInfiniteScrollProps<T> {
  data: T[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  estimateSize?: () => number;
}

const useVirtualInfiniteScroll = <T>({
  data,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  estimateSize = () => 190,
}: UseVirtualInfiniteScrollProps<T>) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? data.length + 1 : data.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (lastItem && lastItem.index >= data.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    data.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return {
    parentRef,
    virtualRows: rowVirtualizer.getVirtualItems(),
    totalSize: rowVirtualizer.getTotalSize(),
  };
};

export default useVirtualInfiniteScroll;
