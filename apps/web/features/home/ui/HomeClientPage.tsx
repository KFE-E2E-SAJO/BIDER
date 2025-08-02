'use client';

import LocationPin from '@/features/location/ui/LocationPin';
import Loading from '@/shared/ui/Loading/Loading';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@repo/ui/components/Button/Button';
import { List, Map } from 'lucide-react';
import { AuctionMarkerResponse, AuctionSort } from '@/features/auction/list/types';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { LocationWithAddress } from '@/features/location/types';
import GoogleMapSkeleton from '@/features/location/ui/GoogleMapSkeleton';
import dynamic from 'next/dynamic';

const GoogleMapView = dynamic(() => import('@/features/location/ui/GoogleMapView'), {
  ssr: false,
  loading: () => <GoogleMapSkeleton />,
});

const AuctionSortDropdown = dynamic(
  () => import('@/features/auction/list/ui/AuctionSortDropdown'),
  {
    ssr: false,
  }
);

const AuctionList = dynamic(() => import('@/features/auction/list/ui/AuctionList'), {
  ssr: false,
  loading: () => <Loading />,
});

interface HomeClientPageProps {
  userLocation: LocationWithAddress;
  auctionMarkers: AuctionMarkerResponse[];
}

type SheetMode = 'collapsed' | 'half' | 'full';

const HomeClientPage = ({ userLocation, auctionMarkers }: HomeClientPageProps) => {
  const [sheetMode, setSheetMode] = useState<SheetMode>('half');
  const [sort, setSort] = useState<AuctionSort>(DEFAULT_AUCTION_LIST_PARAMS.sort);
  const sheetRef = useRef<HTMLDivElement>(null);

  const getTranslateY = () => {
    switch (sheetMode) {
      case 'collapsed':
        return '88%'; // 지도만 보임
      case 'half':
        return '45%'; // 지도 + 리스트 반반
      case 'full':
        return '0%'; // 리스트만 보임
    }
  };

  // 스와이프 제스처 (간단한 touch 이벤트)
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    let startY = 0;
    let currentY = 0;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches?.[0];
      if (!touch) return;
      startY = touch.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches?.[0];
      if (!touch) return;
      currentY = touch.clientY;
    };

    const onTouchEnd = () => {
      const delta = currentY - startY;
      if (delta > 50) {
        // 아래로 스와이프
        setSheetMode((prev) =>
          prev === 'full' ? 'half' : prev === 'half' ? 'collapsed' : 'collapsed'
        );
      } else if (delta < -50) {
        // 위로 스와이프
        setSheetMode((prev) => (prev === 'collapsed' ? 'half' : prev === 'half' ? 'full' : 'full'));
      }
    };

    sheet.addEventListener('touchstart', onTouchStart);
    sheet.addEventListener('touchmove', onTouchMove);
    sheet.addEventListener('touchend', onTouchEnd);

    return () => {
      sheet.removeEventListener('touchstart', onTouchStart);
      sheet.removeEventListener('touchmove', onTouchMove);
      sheet.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <>
      <div
        className="relative h-dvh w-full overflow-hidden"
        style={{ height: 'calc(100dvh - 167px)' }}
      >
        {/* 배경 전체 지도 */}
        <GoogleMapView
          mapId="auctionList"
          height="h-full"
          location={userLocation.location}
          showMyLocation={false}
          markers={auctionMarkers}
          showMarkers={true}
        />

        {/* 하단 리스트 시트 */}
        <div
          ref={sheetRef}
          className="absolute left-0 right-0 top-0 z-10 h-full transition-transform duration-300"
          style={{ transform: `translateY(${getTranslateY()})` }}
        >
          <div
            className={`flex h-full flex-col bg-white shadow-lg ${sheetMode !== 'full' ? 'rounded-t-2xl' : ''} `}
          >
            {/* 상단 핸들 */}
            {sheetMode !== 'full' && (
              <div className="flex items-center justify-center pt-[10px]">
                <div className="h-[6px] w-[75px] rounded-full bg-neutral-300" />
              </div>
            )}

            <div
              className={`p-box flex items-center justify-between pb-[20px] ${sheetMode === 'full' ? 'pt-[5px]' : 'pt-[24px]'}`}
            >
              <LocationPin address={userLocation.address} />
              <AuctionSortDropdown sort={sort} setSort={setSort} />
            </div>

            {/* 리스트 */}
            <div className={`flex-1 overflow-y-scroll ${sheetMode !== 'full' ? 'pb-[300px]' : ''}`}>
              <AuctionList sort={sort} />
            </div>
          </div>
        </div>
        {sheetMode === 'full' && (
          <Button
            shape="rounded"
            size="fit"
            className="typo-caption-medium fixed bottom-[112px] left-1/2 z-20 h-10 -translate-x-1/2 bg-neutral-900"
            onClick={() => {
              setSheetMode('collapsed');
            }}
          >
            <Map size="18" strokeWidth={1.5} /> 지도로 보기
          </Button>
        )}
      </div>
    </>
  );
};

export default HomeClientPage;
