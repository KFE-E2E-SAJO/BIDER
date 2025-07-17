'use client';

import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Location } from '@/features/location/types';
import { ProductMapList } from '@/features/product/types';
import { MapMarkers } from '@/features/location/ui/MapMarkers';

const MAPAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export interface GoogleMapViewProps {
  height?: string;
  mapId: string;
  location?: Location;
  markers: ProductMapList[];
  showMyLocation?: boolean;
}

const GoogleMapView = ({
  height = 'h-[200px]',
  mapId,
  location,
  markers = [],
  showMyLocation = true,
}: GoogleMapViewProps) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (location) {
      setCurrentLocation(location);
    }
  }, [location]);

  if (!currentLocation) return null;

  return (
    <div className={`${height}`}>
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

          <MapMarkers pois={markers} />
        </Map>
      </APIProvider>
    </div>
  );
};

export default GoogleMapView;
