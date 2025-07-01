import { ProductForList } from '@/features/product/types';
import ProductItem from '@/features/product/ui/ProductItem';
import Link from 'next/link';
import ProductChatBtn from './ProductChatBtn';

interface ProductListProps {
  data: ProductForList[];
}
const ProductList = ({ data }: ProductListProps) => {
  if (data.length === 0) {
    return <p className="mt-10 text-center text-neutral-500">등록된 상품이 없습니다.</p>;
  }
  return (
    <ul>
      {data.map((item) => (
        <li key={item.id} className="border-b border-neutral-100 py-[20px] last:border-none">
          <Link href={`/product/${item.id}`}>
            <ProductItem {...item} />
          </Link>

          <div>
            <ProductChatBtn winnerId={item.winnerId} sellerId={item.sellerId} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
