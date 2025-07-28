import { useGetUserLocation } from '@/features/location/model/useGetUserLocation';
import { useAuthStore } from '@/shared/model/authStore';
import { Button } from '@repo/ui/components/Button/Button';
import { MapPin } from 'lucide-react';

interface LocationPinProps {
  address?: string;
}
const LocationPin = ({ address }: LocationPinProps) => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const { data, isLoading } = useGetUserLocation(userId, {
    enabled: !address && !!userId,
  });

  const fallbackAddress = !address && !isLoading ? data?.address : '';
  const displayAddress = address ?? fallbackAddress;

  return (
    <Button shape="rounded" className="typo-caption-medium h-8 bg-neutral-900" size="fit">
      <MapPin size={14} strokeWidth={1.5} />
      {displayAddress}
    </Button>
  );
};

export default LocationPin;
