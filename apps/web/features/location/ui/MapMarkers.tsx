import { InfoWindow, useMap } from '@vis.gl/react-google-maps';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { type Marker, MarkerClusterer } from '@googlemaps/markerclusterer';
import { ProductMapList } from '@/features/product/types';
import { MarkerItem } from '@/features/location/ui/MarkerItem';
import Image from 'next/image';
import Link from 'next/link';
import { encodeUUID } from '@/shared/lib/shortUuid';

export type MapMarkersProps = {
  pois: ProductMapList[];
};

export const MapMarkers = ({ pois }: MapMarkersProps) => {
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const [selectedMarkerKey, setSelectedMarkerKey] = useState<string | null>(null);

  const selectedMarker = useMemo(
    () => (pois && selectedMarkerKey ? pois.find((t) => t.id === selectedMarkerKey)! : null),
    [pois, selectedMarkerKey]
  );

  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({ map });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers((markers) => {
      if ((marker && markers[key]) || (!marker && !markers[key])) return markers;

      if (marker) {
        return { ...markers, [key]: marker };
      } else {
        const { [key]: _, ...newMarkers } = markers;

        return newMarkers;
      }
    });
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarkerKey(null);
  }, []);

  const handleMarkerClick = useCallback((marker: ProductMapList) => {
    setSelectedMarkerKey(marker.id);
  }, []);

  return (
    <>
      {pois.map((poi) => (
        <MarkerItem
          key={poi.id}
          poi={poi}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
        />
      ))}

      {selectedMarkerKey && selectedMarker?.thumbnail && (
        <InfoWindow
          anchor={markers[selectedMarkerKey]}
          onCloseClick={handleInfoWindowClose}
          pixelOffset={[0, -20]} // 살짝 위로 띄움
        >
          <div className="flex w-[100px]">
            <div className="relative aspect-square w-full overflow-hidden rounded-md">
              <Link href={`/auction/${encodeUUID(selectedMarker.id)}`}>
                <Image
                  src={selectedMarker.thumbnail}
                  alt="Marker Thumbnail"
                  fill
                  className="object-cover"
                />
              </Link>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};
