import { Button } from '@repo/ui/components/Button/Button';
import { MapPin } from 'lucide-react';

//유저정보 받아서 위치 넣어줘야함

const LocationPin = () => {
  return (
    <div className="my-[21px]">
      <Button shape="rounded" className="typo-caption-medium h-8 bg-neutral-900" size="fit">
        <MapPin size={14} />
        강남구 역삼동
      </Button>
    </div>
  );
};

export default LocationPin;
