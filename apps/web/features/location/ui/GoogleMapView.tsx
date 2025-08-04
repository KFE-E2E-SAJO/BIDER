'use client';

import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Location } from '@/features/location/types';
import { MapMarkers } from '@/features/location/ui/MapMarkers';
import { AuctionMarkerResponse } from '@/features/auction/list/types';
import GoogleMapPinBottomCard from '@/features/location/ui/GoogleMapPinBottomCard';
import GoogleMapAdjustCenter from '@/features/location/ui/GoogleMapAdjustCenter';

const MAPAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export interface GoogleMapViewProps {
  height?: string;
  mapId: string;
  location: Location;
  markers?: AuctionMarkerResponse[];
  showMyLocation?: boolean;
  showMarkers?: boolean;
  onMarkerClick?: (marker: AuctionMarkerResponse) => void;
}

const GoogleMapView = ({
  height = 'h-[200px]',
  mapId,
  location,
  markers = [],
  showMyLocation = true,
  showMarkers = false,
  onMarkerClick,
}: GoogleMapViewProps) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<AuctionMarkerResponse | null>(null);

  console.log(selectedMarker);

  useEffect(() => {
    if (location) {
      setCurrentLocation(location);
    }
  }, [location]);

  if (!currentLocation) return null;

  return (
    <div className={`${height} bg-neutral-100`}>
      <APIProvider apiKey={MAPAPIKEY}>
        <Map
          defaultZoom={13}
          defaultCenter={currentLocation}
          mapId={mapId}
          disableDefaultUI
          gestureHandling="greedy"
        >
          <GoogleMapAdjustCenter />

          {showMyLocation && (
            <AdvancedMarker position={currentLocation}>
              <Pin
                background="var(--color-main)"
                glyphColor="var(--color-neutral-0)"
                borderColor="var(--color-main)"
              />
            </AdvancedMarker>
          )}

          {showMarkers && (
            <MapMarkers
              pois={markers}
              selectedMarkerId={selectedMarker?.id ?? null}
              onMarkerSelect={(marker) => {
                onMarkerClick?.(marker);
                setSelectedMarker(marker);
              }}
            />
          )}
        </Map>
      </APIProvider>

      {selectedMarker && (
        <GoogleMapPinBottomCard product={selectedMarker} onClose={() => setSelectedMarker(null)} />
      )}
    </div>
  );
};

export default GoogleMapView;
