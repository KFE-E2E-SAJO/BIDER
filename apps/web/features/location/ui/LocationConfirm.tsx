'use client';

import { Button } from '@repo/ui/components/Button/Button';
import GoogleMap from '@/features/location/ui/GooggleMap';
import useUpdateLocation from '@/features/location/model/useUpdateLocation';
import clsx from 'clsx';
import { Location } from '@/features/location/types';
import { useState } from 'react';

const LocationConfirm = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const { mutate: locationMutate, isPending: isLocationUpdatePending } = useUpdateLocation();

  const handleNext = async () => {
    if (!location) {
      return;
    }
    if (!address) {
      return;
    }

    locationMutate({
      location,
      address,
    });
  };

  return (
    <>
      <div className="p-box flex flex-1 flex-col justify-center">
        <h2 className="typo-subtitle-medium mb-[16px] text-neutral-900">
          <span className="text-main">현재 위치</span>가 맞으신가요?
        </h2>
        <div className="typo-body-regular mb-[29px] text-neutral-700">
          <p>모든 회원은 거래를 위해</p>
          <p>사용자 위치를 설정해야 합니다.</p>
        </div>

        <GoogleMap setLocation={setLocation} setAddress={setAddress} mapId="setLocation" />
      </div>

      <div>
        <div className="bg-warning-light text-warning-medium typo-body-medium flex h-[42px] items-center justify-center">
          반경 3km 이내의 오차가 있을 수 있습니다.
        </div>
        <div
          className={clsx(
            'h-24 pt-3',
            isLocationUpdatePending || !location ? 'bg-neutral-300' : 'bg-main'
          )}
        >
          <Button onClick={handleNext} disabled={isLocationUpdatePending || !location || !address}>
            위치 저장
          </Button>
        </div>
      </div>
    </>
  );
};

export default LocationConfirm;
