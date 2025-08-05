import { useState } from 'react';
import { UploadedImage } from '@/shared/lib/ImageUploadPreview';
import { CategoryValue } from '@/features/category/types';
import { ProductFormActions, ProductFormState } from '@/features/product/types';

const initialState: Omit<ProductFormState, 'isSubmitting'> = {
  title: '',
  category: '',
  description: '',
  dealLatitude: '',
  dealLongitude: '',
  dealAddress: '',
  minPrice: '',
  endDate: '',
  endTime: '',
  isSecret: false,
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
  const [isSecret, setIsSecret] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setMinPrice('');
    setEndDate('');
    setEndTime('');
    setImages([]);
    setIsSecret(false);
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
    isSecret,
    setIsSecret,
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
  const [dealLongitude, setDealLongitude] = useState(initialState.dealLongitude);
  const [dealLatitude, setDealLatitude] = useState(initialState.dealLatitude);
  const [dealAddress, setDealAddress] = useState(initialState.dealAddress);
  const [minPrice, setMinPrice] = useState(initialState.minPrice);
  const [endDate, setEndDate] = useState(initialState.endDate);
  const [endTime, setEndTime] = useState(initialState.endTime);
  const [images, setImages] = useState<UploadedImage[]>(initialState.images);
  const [isSecret, setIsSecret] = useState(initialState.isSecret);

  const reset = () => {
    setTitle(initialState.title);
    setCategory(initialState.category);
    setDescription(initialState.description);
    setDealLongitude(initialState.dealLongitude);
    setDealLatitude(initialState.dealLatitude);
    setDealAddress(initialState.dealAddress);
    setMinPrice(initialState.minPrice);
    setEndDate(initialState.endDate);
    setEndTime(initialState.endTime);
    setImages(initialState.images);
    setIsSecret(initialState.isSecret);
  };

  return {
    // State
    title,
    category,
    description,
    dealLongitude,
    dealLatitude,
    dealAddress,
    minPrice,
    endDate,
    endTime,
    images,
    isSecret,
    // Actions
    setTitle,
    setCategory,
    setDescription,
    setDealLongitude,
    setDealLatitude,
    setDealAddress,
    setMinPrice,
    setEndDate,
    setEndTime,
    setImages,
    setIsSecret,
    reset,
  };
};
