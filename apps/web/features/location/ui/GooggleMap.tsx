'use client';

import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import Loading from '@/shared/ui/Loading/Loading';
import { useEffect, useState } from 'react';
import { getKoreanAddress } from '@/features/location/api/getKoreanAddress';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { Button } from '@repo/ui/components/Button/Button';
import { Location } from '@/features/location/types';
import { getGeoPermissionState } from '@/features/location/lib/utils';

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
  const [showGuide, setShowGuide] = useState(false);
  const openGuide = () => {
    setShowGuide(true);
    toast({ content: '위치 접근이 차단되어 있어요. 브라우저 설정에서 허용으로 변경해주세요.' });
  };

  const fetchLocation = async () => {
    setLoading(true);
    setError(false);

    const state = await getGeoPermissionState();

    if (state === 'denied') {
      openGuide();
      setError(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        console.log(coords);
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
        if (err.code === err.PERMISSION_DENIED) {
          openGuide();
        } else {
          toast({ content: '지도를 불러오는 데 문제가 발생했습니다.' });
          console.error('지도를 불러오는 데 문제가 발생했습니다.', err);
        }
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

  if (showGuide) {
    return (
      <div className="bg-neutral-050 rounded-xl border p-3 text-sm">
        <div className="mb-2 font-medium">위치 접근이 차단되었습니다</div>
        <ul className="list-disc space-y-1 pl-5">
          <li>사이트가 HTTPS인지 확인</li>
          <li>
            브라우저 주소창 자물쇠 아이콘 → 사이트 설정 → <b>위치: 허용</b>
          </li>
          <li>
            iOS Safari: 설정 앱 → 개인정보 보호/보안 → 위치 서비스 → <b>Safari 웹사이트</b> → 허용
          </li>
          <li>Android: 설정 → 위치 켜기, 브라우저 앱 권한 허용</li>
        </ul>
        <div className="mt-2 flex gap-8">
          <Button size="sm" variant="outline" onClick={() => setShowGuide(false)}>
            닫기
          </Button>
          <Button size="sm" onClick={fetchLocation}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

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
