import React from 'react';
import { ProductRegistrationForm } from '@/features/product/ui/ProductRegistrationForm';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const ProductRegistrationPage = () => {
  return (
    <ReactQueryProvider>
      <div className="pt-[16px]">
        <ProductRegistrationForm />
      </div>
    </ReactQueryProvider>
  );
};

export default ProductRegistrationPage;
