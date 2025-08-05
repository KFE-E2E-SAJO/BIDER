'use client';

import LocationPin from '@/features/location/ui/LocationPin';
import Loading from '@/shared/ui/Loading/Loading';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@repo/ui/components/Button/Button';
import { Map } from 'lucide-react';
import { AuctionMarkerResponse, AuctionSort } from '@/features/auction/list/types';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { LocationWithAddress } from '@/features/location/types';
import GoogleMapSkeleton from '@/features/location/ui/GoogleMapSkeleton';
import dynamic from 'next/dynamic';
import { getListHeight } from '@/features/auction/list/lib/utils';
import { SheetMode } from '@/features/home/types';

const GoogleMapView = dynamic(() => import('@/features/location/ui/GoogleMapView'), {
  ssr: false,
  loading: () => <GoogleMapSkeleton />,
});

const AuctionSortDropdown = dynamic(
  () => import('@/features/auction/list/ui/AuctionSortDropdown'),
  { ssr: false }
);

const AuctionList = dynamic(() => import('@/features/auction/list/ui/AuctionList'), {
  ssr: false,
  loading: () => <Loading />,
});

interface HomeClientPageProps {
  userLocation: LocationWithAddress;
  auctionMarkers: AuctionMarkerResponse[];
}

const HomeClientPage = ({ userLocation, auctionMarkers }: HomeClientPageProps) => {
  const [sheetMode, setSheetMode] = useState<SheetMode>('half');
  const [showList, setShowList] = useState(true);
  const [sort, setSort] = useState<AuctionSort>(DEFAULT_AUCTION_LIST_PARAMS.sort);
  const [listHeight, setListHeight] = useState(getListHeight('home', showList));
  const [mapHeight, setMapHeight] = useState('h-[300px]');

  const getTranslateY = () => {
    switch (sheetMode) {
      case 'collapsed':
        return '92%'; // 지도만 보임
      case 'half':
        return '280px'; // 지도 + 리스트 반반
      case 'full':
        return '0%'; // 리스트만 보임
    }
  };

  useEffect(() => {
    if (sheetMode === 'half') {
      setMapHeight('h-[300px]');
      setShowList(true);
    } else if (sheetMode === 'full') {
      setMapHeight('h-0');
      setShowList(true);
    } else {
      setMapHeight('h-full');
      setShowList(false);
    }
  }, [sheetMode]);

  useEffect(() => {
    setListHeight(getListHeight('home', showList));
  }, [showList]);

  const sheetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging = true;
    startY = e.clientY;
    currentY = startY;

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    currentY = e.clientY;
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;

    const delta = currentY - startY;
    if (delta > 50) {
      setSheetMode((prev) =>
        prev === 'full' ? 'half' : prev === 'half' ? 'collapsed' : 'collapsed'
      );
    } else if (delta < -50) {
      setSheetMode((prev) => (prev === 'collapsed' ? 'half' : prev === 'half' ? 'full' : 'full'));
    }

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  };

  return (
    <>
      <div className="relative w-full overflow-hidden" style={{ height: 'calc(100svh - 167px)' }}>
        {/* 배경 전체 지도 */}
        <GoogleMapView
          mapId="auctionList"
          height={mapHeight}
          location={userLocation.location}
          showMyLocation={false}
          markers={auctionMarkers}
          showMarkers={true}
          setSheetMode={setSheetMode}
        />

        {/* 하단 리스트 시트 */}
        <div
          ref={sheetRef}
          className="absolute left-0 right-0 top-0 z-10 h-full transition-transform duration-300"
          style={{ transform: `translateY(${getTranslateY()})` }}
        >
          <div
            className={`flex h-full flex-col overflow-y-hidden bg-white shadow-lg ${sheetMode !== 'full' ? 'rounded-t-2xl' : ''} `}
          >
            <div
              ref={handleRef}
              onPointerDown={onPointerDown}
              style={{ touchAction: 'none' }}
              className="cursor-pointer"
            >
              {sheetMode !== 'full' && (
                <div
                  className={`flex items-center justify-center pt-[10px] ${sheetMode === 'collapsed' ? 'pb-[50px]' : 'pb-[24px]'} `}
                >
                  <div className="h-[6px] w-[75px] rounded-full bg-neutral-300" />
                </div>
              )}

              {sheetMode !== 'collapsed' && (
                <div
                  className={`p-box flex items-center justify-between pb-[20px] ${sheetMode === 'full' ? 'pt-[10px]' : 'pt-0'}`}
                >
                  <LocationPin address={userLocation.address} />
                  <AuctionSortDropdown sort={sort} setSort={setSort} />
                </div>
              )}
            </div>

            {/* 리스트 */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ paddingBottom: sheetMode === 'half' ? '279px' : '0' }}
            >
              <AuctionList sort={sort} height={listHeight} />
            </div>
          </div>
        </div>
        {sheetMode === 'full' && (
          <Button
            shape="rounded"
            size="fit"
            className="typo-caption-medium fixed bottom-[122px] left-1/2 z-20 h-10 -translate-x-1/2 bg-neutral-900"
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
