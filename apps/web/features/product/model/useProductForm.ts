import { useState } from 'react';
import { UploadedImage } from '@/shared/lib/ImageUploadPreview';
import { CategoryValue } from '@/features/category/types';
import { ProductFormActions, ProductFormState } from '../types';

const initialState: Omit<ProductFormState, 'isSubmitting'> = {
  title: '',
  category: '',
  description: '',
  minPrice: '',
  endDate: '',
  endTime: '',
  images: [],
};

export const useProductForm = (options?: { withSubmitting?: boolean }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryValue | string>('');
  const [description, setDescription] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setMinPrice('');
    setEndDate('');
    setEndTime('');
    setImages([]);
    setIsSubmitting(false);
  };

  const base = {
    title,
    setTitle,
    category,
    setCategory,
    description,
    setDescription,
    minPrice,
    setMinPrice,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    images,
    setImages,
    reset,
  };

  return options?.withSubmitting ? { ...base, isSubmitting, setIsSubmitting } : base;
};

// TanStack Query 사용 시 isSubmitting은 mutation 상태에서 가져오므로 제거
export const useProductFormWithoutSubmitting = (): Omit<ProductFormState, 'isSubmitting'> &
  Omit<ProductFormActions, 'setIsSubmitting'> => {
  const [title, setTitle] = useState(initialState.title);
  const [category, setCategory] = useState<CategoryValue | string>(initialState.category);
  const [description, setDescription] = useState(initialState.description);
  const [minPrice, setMinPrice] = useState(initialState.minPrice);
  const [endDate, setEndDate] = useState(initialState.endDate);
  const [endTime, setEndTime] = useState(initialState.endTime);
  const [images, setImages] = useState<UploadedImage[]>(initialState.images);

  const reset = () => {
    setTitle(initialState.title);
    setCategory(initialState.category);
    setDescription(initialState.description);
    setMinPrice(initialState.minPrice);
    setEndDate(initialState.endDate);
    setEndTime(initialState.endTime);
    setImages(initialState.images);
  };

  return {
    // State
    title,
    category,
    description,
    minPrice,
    endDate,
    endTime,
    images,
    // Actions
    setTitle,
    setCategory,
    setDescription,
    setMinPrice,
    setEndDate,
    setEndTime,
    setImages,
    reset,
  };
};
