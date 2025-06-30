import { Product } from '@/features/product/types';
import { ListItem } from '@/features/product/ui/ListItem';
import Line from '@/shared/ui/Line/Line';
import Link from 'next/link';

interface ProductListProps {
  data: Product[];
}
const ProductList = ({ data }: ProductListProps) => {
  console.log(data);
  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          <Link href={`/product/${item.id}`}>
            <ListItem {...item} />
          </Link>
          <Line className="my-[20px]" />
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
