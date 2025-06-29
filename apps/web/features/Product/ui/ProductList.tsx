import { Product } from '@/features/Product/types';
import { ListItem } from '@/features/Product/ui/ListItem';
import Line from '@/shared/ui/Line/Line';

interface ProductListProps {
  data: Product[];
}
const ProductList = ({ data }: ProductListProps) => {
  return (
    <ul>
      {data.map((item, idx) => (
        <li key={idx}>
          <ListItem {...item} />
          <Line className="my-[20px]" />
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
