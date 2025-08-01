import { ProductList as ProductListType } from '@/features/product/types';
import ProductActionBtn from '@/features/product/ui/ProductActionBtn';
import ProductItem from '@/features/product/ui/ProductItem';
import { encodeUUID } from '@/shared/lib/shortUuid';
import Link from 'next/link';

interface ProductListProps {
  data: ProductListType[];
}
const ProductList = ({ data }: ProductListProps) => {
  if (data.length === 0) {
    return <p className="mt-10 text-center text-neutral-500">상품이 존재하지 않습니다.</p>;
  }
  return (
    <ul>
      {data.map((item) => (
        <li key={item.id} className="border-b border-neutral-100 py-[20px] last:border-none">
          {!item.isPending ? (
            <Link href={`/auction/${encodeUUID(item.id)}`}>
              <ProductItem {...item} />
            </Link>
          ) : (
            <ProductItem {...item} />
          )}
          <div>
            <ProductActionBtn
              {...{
                auctionStatus: item.auctionStatus,
                isAwarded: item.isAwarded,
                winnerId: item.winnerId,
                sellerId: item.sellerId,
                itemId: item.id,
                isPending: item.isPending,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
