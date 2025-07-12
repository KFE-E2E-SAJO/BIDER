import { updateLocation } from '@/features/location/api/updateLocation';
import { useLocationStore } from '@/features/location/model/useLocationStore';
import { UpdateLocationProps } from '@/features/location/types';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { useMutation } from '@tanstack/react-query';

const useUpdateLocation = () => {
  const goNext = useLocationStore((state) => state.goNext);

  return useMutation({
    mutationFn: (props: UpdateLocationProps) => updateLocation(props),
    onSuccess: () => {
      goNext();
    },
    onError: (error) => {
      console.error('위치 저장 실패:', error);
      toast({ content: '위치 저장에 실패했습니다.' });
    },
  });
};

export default useUpdateLocation;
