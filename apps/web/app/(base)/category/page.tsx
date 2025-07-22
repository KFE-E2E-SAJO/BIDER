import Category from '@/features/category/ui/Category';
import { Suspense } from 'react';

const CategoryPage = () => {
  return (
    <Suspense fallback={null}>
      <Category />
    </Suspense>
  );
};

export default CategoryPage;
