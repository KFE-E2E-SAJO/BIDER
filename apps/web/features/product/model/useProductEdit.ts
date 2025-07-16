import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { UploadedImage } from '@/shared/lib/ImageUploadPreview';
import {
  mapProductImagesToUploadedImages,
  formatProductDateTime,
  createFormDataFromProduct,
  handleMinPriceChange,
} from '../lib/editFormUtils';
import { canEditProduct, isEndDateAfterInitialDate, validateProductEditForm } from '../lib/utils';
import { useProductEditQuery } from './useProductForEdit';
import { useProductUpdateMutation } from './useProductUpdate';

export const useProductEdit = (shortId: string) => {
  const router = useRouter();
  const { data, isLoading: loading, error } = useProductEditQuery(shortId);
  const { mutate: submitUpdate, isPending: isSubmitting } = useProductUpdateMutation(shortId);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const mappedImages = useMemo(() => mapProductImagesToUploadedImages(data?.product_image), [data]);

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

  const handleSubmit = () => {
    if (!data) return;

    if (!canEditProduct(data.created_at)) {
      toast({ content: '상품 수정 가능 시간이 만료되었습니다!' });
      router.back();
      return;
    }

    if (!isEndDateAfterInitialDate(endDate, endTime, data.created_at)) {
      toast({ content: '경매 종료일시는 상품 등록 시각 기준으로 1시간 이후여야 합니다.' });
      return;
    }

    const formData = { title, category, description, minPrice, endDate, endTime, images };
    if (!validateProductEditForm(formData)) {
      toast({ content: '모든 필수 항목을 입력해 주세요' });
      return;
    }

    const submitData = createFormDataFromProduct(formData, images);

    submitUpdate(submitData, {
      onSuccess: () => {
        toast({ content: '수정이 완료되었습니다!' });
        router.push('/auction/listings');
      },
      onError: () => {
        toast({ content: '알 수 없는 오류가 발생했어요.' });
      },
    });
  };

  return {
    data,
    loading,
    error: error instanceof Error ? error.message : null,
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
