'use client';

import React, { use } from 'react';
import { ProductEditForm } from '@/features/product/ui/ProductEditForm';
import { ProductEditPageProps } from '@/features/product/types';

const ProductEditPage: React.FC<ProductEditPageProps> = ({ params }) => {
  const resolvedParams = use(params);

  return <ProductEditForm shortId={resolvedParams.shortId} />;
};

export default ProductEditPage;
