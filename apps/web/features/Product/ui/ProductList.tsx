import { ProductForList } from '@/features/product/types';
import ProductItem from '@/features/product/ui/ProductItem';
import { encodeUUID } from '@/shared/lib/shortUuid';
import Line from '@/shared/ui/Line/Line';
import Link from 'next/link';

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
        <li key={item.id}>
          <Link href={`/auction/${encodeUUID(item.id)}`}>
            <ProductItem {...item} />
          </Link>
          <Line className="my-[20px]" />
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
