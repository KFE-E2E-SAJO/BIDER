import { InfoWindow, useMap } from '@vis.gl/react-google-maps';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { type Marker, MarkerClusterer } from '@googlemaps/markerclusterer';
import { MarkerItem } from '@/features/location/ui/MarkerItem';
import Image from 'next/image';
import Link from 'next/link';
import { encodeUUID } from '@/shared/lib/shortUuid';
import { AuctionMarkerResponse } from '@/features/auction/list/types';

export type MapMarkersProps = {
  pois: AuctionMarkerResponse[];
  onMarkerSelect: (poi: AuctionMarkerResponse) => void;
  selectedMarkerId?: string | null;
};

export const MapMarkers = ({ pois, onMarkerSelect, selectedMarkerId }: MapMarkersProps) => {
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});

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

  const handleMarkerClick = useCallback(
    (marker: AuctionMarkerResponse) => {
      onMarkerSelect(marker);
    },
    [onMarkerSelect]
  );

  return (
    <>
      {pois.map((poi) => (
        <MarkerItem
          key={poi.id}
          poi={poi}
          isSelected={selectedMarkerId === poi.id}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
        />
      ))}
    </>
  );
};
