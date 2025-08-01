'use client';

import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Location } from '@/features/location/types';
import { MapMarkers } from '@/features/location/ui/MapMarkers';
import { AuctionMarkerResponse } from '@/features/auction/list/types';

const MAPAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export interface GoogleMapViewProps {
  height?: string;
  mapId: string;
  location: Location;
  markers?: AuctionMarkerResponse[];
  showMyLocation?: boolean;
  showMarkers?: boolean;
}

const GoogleMapView = ({
  height = 'h-[200px]',
  mapId,
  location,
  markers = [],
  showMyLocation = true,
  showMarkers = false,
}: GoogleMapViewProps) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

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
          {showMyLocation && (
            <AdvancedMarker position={currentLocation}>
              <Pin
                background="var(--color-main)"
                glyphColor="var(--color-neutral-0)"
                borderColor="var(--color-main)"
              />
            </AdvancedMarker>
          )}

          {showMarkers && <MapMarkers pois={markers} />}
        </Map>
      </APIProvider>
    </div>
  );
};

export default GoogleMapView;
