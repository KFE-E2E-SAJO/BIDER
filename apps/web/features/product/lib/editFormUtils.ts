import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { ProductForEdit } from '@/entities/product/model/types';
import { UploadedImage } from '@/shared/lib/ImageUploadPreview';
import { ProductEditFormData } from '../types';

export const createFormDataFromProduct = (
  data: ProductEditFormData,
  images: UploadedImage[]
): FormData => {
  const endAt = new Date(`${data.endDate}T${data.endTime}`);
  const numericPrice = parseInt(data.minPrice.replace(/,/g, ''), 10);

  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('min_price', numericPrice.toString());
  formData.append('category', data.category);
  formData.append('end_at', endAt.toISOString());

  images.forEach((img, index) => {
    if (img.file) {
      // 새 이미지
      formData.append('images', img.file);
      formData.append(`image_order_${index}`, `NEW_IMAGE_${index}`);
    } else {
      // 기존 이미지
      formData.append(`image_order_${index}`, img.id.toString());
    }
  });

  return formData;
};

export const mapProductImagesToUploadedImages = (
  productImages: ProductForEdit['product_image'] | undefined
): UploadedImage[] => {
  if (!productImages) return [];

  return [...productImages]
    .sort((a, b) => a.order_index - b.order_index)
    .map((img, index) => ({
      id: img.image_id,
      file: null,
      preview: img.image_url,
      order_index: index === 0 ? 0 : 1,
    }));
};

export const formatProductDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toISOString().slice(0, 10), // 'YYYY-MM-DD'
    time: date.toTimeString().slice(0, 5), // 'HH:MM'
  };
};

export const handleMinPriceChange = (value: string): string => {
  const numericOnly = value.replace(/\D/g, '');
  return formatNumberWithComma(numericOnly);
};
