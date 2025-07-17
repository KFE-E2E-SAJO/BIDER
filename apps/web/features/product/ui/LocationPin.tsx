import { useAuthStore } from '@/shared/model/authStore';
import { Button } from '@repo/ui/components/Button/Button';
import { MapPin } from 'lucide-react';

const LocationPin = () => {
  const userAddress = useAuthStore((state) => state.user?.address);

  return (
    <Button shape="rounded" className="typo-caption-medium h-8 bg-neutral-900" size="fit">
      <MapPin size={14} />
      {userAddress}
    </Button>
  );
};

export default LocationPin;
