import { ProductForList } from '@/features/product/types';
import ProductItem from '@/features/product/ui/ProductItem';
import Link from 'next/link';
import ProductChatBtn from './ProductChatBtn';

interface ProductListProps {
  data: ProductForList[];
}
const ProductList = ({ data }: ProductListProps) => {
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
