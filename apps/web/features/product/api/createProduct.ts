import { combineDateTime, parseFormattedPrice } from '../lib/utils';
import { ApiError, CreateProductRequest, CreateProductResponse } from '../types';

export const createProduct = async (data: CreateProductRequest): Promise<CreateProductResponse> => {
  const endAt = combineDateTime(data.endDate, data.endTime);
  const numericPrice = parseFormattedPrice(data.minPrice);

  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('min_price', numericPrice.toString());
  formData.append('end_at', endAt.toISOString());
  formData.append('category', data.category);
  formData.append('user_id', data.userId);
  if (data.dealLongitude !== undefined) {
    formData.append('deal_longitude', data.dealLongitude.toString());
  }
  if (data.dealLatitude !== undefined) {
    formData.append('deal_latitude', data.dealLatitude.toString());
  }
  if (data.dealAddress !== undefined) {
    formData.append('deal_address', data.dealAddress);
  }

  data.images.forEach((img) => {
    if (img.file) {
      formData.append('images', img.file);
    }
  });

  const res = await fetch('/api/product', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json();
    throw new Error(errorData.error || '출품 실패');
  }

  return res.json();
};
