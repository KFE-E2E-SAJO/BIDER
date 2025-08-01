import { Button } from '@repo/ui/components/Button/Button';
import { MapPin } from 'lucide-react';

interface LocationPinProps {
  address: string;
}
const LocationPin = ({ address }: LocationPinProps) => {
  return (
    <Button shape="rounded" className="typo-caption-medium h-8 bg-neutral-900" size="fit">
      <MapPin size={14} strokeWidth={1.5} />
      {address}
    </Button>
  );
};

export default LocationPin;
