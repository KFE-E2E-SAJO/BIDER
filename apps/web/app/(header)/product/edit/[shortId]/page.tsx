'use client';

import React, { use } from 'react';
import { ProductEditForm } from '@/features/product/ui/ProductEditForm';
import { ProductEditPageProps } from '@/features/product/types';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const ProductEditPage: React.FC<ProductEditPageProps> = ({ params }) => {
  const resolvedParams = use(params);

  return (
    <ReactQueryProvider>
      <ProductEditForm shortId={resolvedParams.shortId} />
    </ReactQueryProvider>
  );
};

export default ProductEditPage;
