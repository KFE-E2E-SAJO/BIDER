'use client';

import { ChevronLeft } from 'lucide-react';

const BackBtn = () => {
  return <ChevronLeft onClick={() => window.history.back()} />;
};

export default BackBtn;
