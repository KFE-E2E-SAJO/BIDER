import { ProductForList } from '@/features/product/types';
import ProductItem from '@/features/product/ui/ProductItem';
import Line from '@/shared/ui/Line/Line';
import Link from 'next/link';

interface ProductListProps {
  data: ProductForList[];
}
const ProductList = ({ data }: ProductListProps) => {
  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          <Link href={`/product/${item.id}`}>
            <ProductItem {...item} />
          </Link>
          <Line className="my-[20px]" />
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
