import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import Loading from '@/shared/ui/Loading/Loading';
import { useEffect, useState } from 'react';
import { getKoreanAddress } from '@/features/location/api/getKoreanAddress';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { Button } from '@repo/ui/components/Button/Button';
import { useLocationStore } from '@/features/location/model/useLocationStore';
import { useAuthStore } from '@/shared/model/authStore';

const MAPAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const GoogleMap = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocationStore((state) => state.userLocation);
  const setLocation = useLocationStore((state) => state.setUserLocation);
  const address = useLocationStore((state) => state.userAddress);
  const setAddress = useLocationStore((state) => state.setUserAddress);
  const updateAddress = useAuthStore((state) => state.updateAddress);

  const fetchLocation = () => {
    setLoading(true);
    setError(false);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(coords);
        const koreanAddress = await getKoreanAddress(coords);

        if (koreanAddress) {
          setAddress(koreanAddress);
          updateAddress(koreanAddress);
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
    fetchLocation();
  }, []);

  return (
    <div className="bg-neutral-050 flex h-[200px] flex-col justify-center gap-[8px] rounded-2xl p-[8px] pb-[12px]">
      <APIProvider apiKey={MAPAPIKEY}>
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-danger typo-body-medium flex flex-col items-center gap-2">
            위치 정보를 가져올 수 없습니다.
            <Button onClick={fetchLocation} size="sm" variant="outline">
              다시 시도
            </Button>
          </div>
        ) : (
          <>
            <Map zoom={13} center={location!} disableDefaultUI={true} mapId="setLocation">
              <AdvancedMarker position={location!} clickable={false}>
                <Pin
                  background="var(--color-main)"
                  glyphColor="var(--color-neutral-0)"
                  borderColor="var(--color-main)"
                />
              </AdvancedMarker>
            </Map>
            <div className="text-caption text-neutral-600">{address}</div>
          </>
        )}
      </APIProvider>
    </div>
  );
};

export default GoogleMap;
