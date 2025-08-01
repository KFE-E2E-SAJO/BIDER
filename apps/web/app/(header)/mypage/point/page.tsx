import PointPageContent from '@/features/point/ui/PointPageContent';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';
import React from 'react';

const PointPage = () => {
  return (
    <ReactQueryProvider>
      <PointPageContent />
    </ReactQueryProvider>
  );
};

export default PointPage;
