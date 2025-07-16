'use client';

import { Location } from '@/features/location/types';
import GoogleMap from '@/features/location/ui/GoggleMap';
import { useState } from 'react';

const Test = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  console.log(address);

  return (
    <div className="h-full">
      <GoogleMap
        setLocation={setLocation}
        setAddress={setAddress}
        draggable={true}
        mapId="test"
        height="h-[500px]"
      />
      {location && address ? (
        <>
          <p>{`${location.lat} ${location.lng}`}</p>
          <p>{address}</p>
        </>
      ) : (
        <p>로딩중 ...</p>
      )}
    </div>
  );
};

export default Test;
