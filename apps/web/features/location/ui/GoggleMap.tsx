'use client';

import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import Loading from '@/shared/ui/Loading/Loading';
import { useEffect, useState } from 'react';
import { getKoreanAddress } from '@/features/location/api/getKoreanAddress';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { Button } from '@repo/ui/components/Button/Button';
import { Location } from '@/features/location/types';

const MAPAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export interface GoogleMapProps {
  setLocation: (location: Location) => void;
  setAddress?: (address: string) => void;
  height?: string;
  mapId: string;
  draggable?: boolean;
  initialLocation?: Location;
}

const GoogleMap = ({
  setLocation,
  setAddress,
  height = 'h-[200px]',
  mapId,
  draggable = false,
  initialLocation,
}: GoogleMapProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  const fetchLocation = () => {
    setLoading(true);
    setError(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCurrentLocation(coords);
        setLocation(coords);
        const koreanAddress = await getKoreanAddress(coords);

        if (koreanAddress) {
          setCurrentAddress(koreanAddress);
          setAddress?.(koreanAddress);
        } else {
          setError(true);
        }
        setLoading(false);
      },
      (err) => {
        toast({ content: '지도를 불러오는 데 문제가 발생했습니다.' });
        console.error('지도를 불러오는 데 문제가 발생했습니다.', err);
        setError(true);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (initialLocation) {
      // 🔥 props로 받은 좌표가 있을 경우
      setCurrentLocation(initialLocation);
      setLocation(initialLocation);
      getKoreanAddress(initialLocation).then((koreanAddress) => {
        if (koreanAddress) {
          setCurrentAddress(koreanAddress);
          if (setAddress) setAddress(koreanAddress);
        } else {
          setError(true);
        }
        setLoading(false);
      });
    } else {
      fetchLocation();
    }
  }, []);

  const handleDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (!draggable || !e.latLng) return;

    const newCoords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    setCurrentLocation(newCoords);
    setLocation(newCoords);

    const koreanAddress = await getKoreanAddress(newCoords);
    if (koreanAddress) {
      setCurrentAddress(koreanAddress);
      setAddress?.(koreanAddress);
    }
  };

  return (
    <div
      className={`bg-neutral-050 flex ${height} flex-col justify-center gap-[8px] rounded-2xl p-[8px] pb-[12px]`}
    >
      <APIProvider apiKey={MAPAPIKEY}>
        {loading ? (
          <Loading />
        ) : error || !currentLocation ? (
          <div className="text-danger typo-body-medium flex flex-col items-center gap-2">
            위치 정보를 가져올 수 없습니다.
            <Button onClick={fetchLocation} size="sm" variant="outline">
              다시 시도
            </Button>
          </div>
        ) : (
          <>
            <Map
              defaultZoom={13}
              defaultCenter={currentLocation}
              mapId={mapId}
              disableDefaultUI
              gestureHandling="greedy"
            >
              <AdvancedMarker
                position={currentLocation}
                draggable={draggable}
                onDragEnd={handleDragEnd}
              >
                <Pin
                  background="var(--color-main)"
                  glyphColor="var(--color-neutral-0)"
                  borderColor="var(--color-main)"
                />
              </AdvancedMarker>
            </Map>
            <div className="text-caption text-neutral-600">{currentAddress}</div>
          </>
        )}
      </APIProvider>
    </div>
  );
};

export default GoogleMap;
