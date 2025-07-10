import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { ProductForEdit } from '@/entities/product/model/types';
import { UploadedImage } from '@/shared/lib/ImageUploadPreview';
import { fetchProductForEdit, updateProduct } from '../api/editProduct';
import {
  mapProductImagesToUploadedImages,
  formatProductDateTime,
  createFormDataFromProduct,
  handleMinPriceChange,
} from '../lib/editFormUtils';
import { canEditProduct, validateProductEditForm } from '../lib/utils';

export const useProductEdit = (shortId: string) => {
  const router = useRouter();
  const [data, setData] = useState<ProductForEdit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  const mappedImages = useMemo(() => mapProductImagesToUploadedImages(data?.product_image), [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchProductForEdit(shortId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shortId]);

  useEffect(() => {
    if (data) {
      setTitle(data.title || '');
      setCategory(data.category || '');
      setDescription(data.description || '');
      setMinPrice(data.min_price ? handleMinPriceChange(data.min_price.toString()) : '');

      if (data.auction_end_at) {
        const { date, time } = formatProductDateTime(data.auction_end_at);
        setEndDate(date);
        setEndTime(time);
      }
    }
  }, [data]);

  const handleMinPriceUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = handleMinPriceChange(e.target.value);
    setMinPrice(formatted);
  };

  const handleSubmit = async () => {
    if (!data) return;

    if (!canEditProduct(data.created_at)) {
      toast({ content: '상품 수정 가능 시간이 만료되었습니다!' });
      router.back();
      return;
    }

    const formData = { title, category, description, minPrice, endDate, endTime, images };
    if (!validateProductEditForm(formData)) {
      toast({ content: '모든 필수 항목을 입력해 주세요' });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = createFormDataFromProduct(formData, images);
      await updateProduct(shortId, submitData);

      toast({ content: '수정이 완료되었습니다!' });
      setTimeout(() => {
        router.push('/auction/listings');
      }, 0);
    } catch (err) {
      console.error('수정 에러', err);
      toast({ content: '알 수 없는 오류가 발생했어요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    data,
    loading,
    error,
    isSubmitting,
    mappedImages,

    title,
    category,
    description,
    minPrice,
    images,
    endDate,
    endTime,

    setTitle,
    setCategory,
    setDescription,
    setImages,
    setEndDate,
    setEndTime,
    handleMinPriceUpdate,
    handleSubmit,
  };
};
