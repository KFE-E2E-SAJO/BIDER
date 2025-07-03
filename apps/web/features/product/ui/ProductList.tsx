import { ProductForList } from '@/features/product/types';
import ProductActionBtn from '@/features/product/ui/ProductActionBtn';
import ProductItem from '@/features/product/ui/ProductItem';
import { encodeUUID } from '@/shared/lib/shortUuid';
import Link from 'next/link';

interface ProductListProps {
  data: ProductForList[];
}
const ProductList = ({ data }: ProductListProps) => {
  if (data.length === 0) {
    return <p className="mt-10 text-center text-neutral-500">상품이 존재하지 않습니다.</p>;
  }
  return (
    <ul>
      {data.map((item) => (
        <li key={item.id} className="border-b border-neutral-100 py-[20px] last:border-none">
          <Link
            href={
              !item.isPending
                ? `/auction/${encodeUUID(item.id)}` //aucid
                : `/product/edit/${encodeUUID(item.id)}` //proid
            }
          >
            <ProductItem {...item} />
          </Link>
          <div>
            <ProductActionBtn
              {...{
                auctionStatus: item.auctionStatus,
                isAwarded: item.isAwarded,
                winnerId: item.winnerId,
                sellerId: item.sellerId,
                itemId: item.id,
                isPending: item.isPending,
                pendingId: item.pendingId,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
