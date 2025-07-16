import { CategoryValue } from '@/features/category/types';
import { UploadedImage } from '@/shared/lib/ImageUploadPreview';

export interface ProductList {
  id: string;
  thumbnail: string;
  title: string;
  address: string;
  bidCount: number;
  minPrice: number;
  myBidPrice?: number;
  auctionEndAt: string;
  auctionStatus: string;
  winnerId?: string | null;
  sellerId: string;
  isAwarded: boolean;
  isPending?: boolean;
}

export interface ProductListError {
  message: string;
  code?: string;
  status: number;
}
export type ProductSort = 'latest' | 'popular';
export type ProductFilter = 'deadline-today' | 'exclude-ended';

export interface ProductListParams {
  userId: string;
  search?: string;
  cate?: string;
  sort?: ProductSort;
  filter?: ProductFilter[];
}
export interface ProductFormData {
  title: string;
  category: CategoryValue | string;
  description: string;
  minPrice: string;
  endDate: string;
  endTime: string;
  images: UploadedImage[];
}

export interface ProductCreateRequest {
  title: string;
  description: string;
  min_price: number;
  end_at: string;
  category: string;
  user_id: string;
  images: File[];
}

export interface ProductFormState extends ProductFormData {
  isSubmitting: boolean;
}

export interface ProductFormActions {
  setTitle: (title: string) => void;
  setCategory: (category: CategoryValue | string) => void;
  setDescription: (description: string) => void;
  setMinPrice: (price: string) => void;
  setEndDate: (date: string) => void;
  setEndTime: (time: string) => void;
  setImages: (images: UploadedImage[]) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  reset: () => void;
}

export interface CreateProductRequest {
  title: string;
  category: string;
  description: string;
  minPrice: string;
  endDate: string;
  endTime: string;
  images: UploadedImage[];
  userId: string;
}

export interface CreateProductResponse {
  id: string;
  title: string;
  message: string;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  create: () => [...productKeys.all, 'create'] as const,
} as const;

export interface ProductEditFormData {
  title: string;
  category: string;
  description: string;
  minPrice: string;
  endDate: string;
  endTime: string;
  images: UploadedImage[];
}

export interface ProductEditPageProps {
  params: Promise<{ shortId: string }>;
}

export interface ProductEditResponse {
  success: boolean;
  error?: string;
}
