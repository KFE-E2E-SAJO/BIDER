import { useAuthStore } from '@/shared/model/authStore';
import { Button } from '@repo/ui/components/Button/Button';
import { MapPin } from 'lucide-react';

const LocationPin = () => {
  const userAddress = useAuthStore((state) => state.user?.address);
  return (
    <div className="my-[21px]">
      <Button shape="rounded" className="typo-caption-medium h-8 bg-neutral-900" size="fit">
        <MapPin size={14} />
        {userAddress}
      </Button>
    </div>
  );
};

export default LocationPin;
