import type { Marker } from '@googlemaps/markerclusterer';
import React, { useCallback } from 'react';
import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { ProductMapList } from '@/features/product/types';

export type MarkerProps = {
  poi: ProductMapList;
  onClick: (poi: ProductMapList) => void;
  setMarkerRef: (marker: Marker | null, key: string) => void;
};

/**
 * Wrapper Component for an AdvancedMarker for a single tree.
 */
export const MarkerItem = (props: MarkerProps) => {
  const { poi, onClick, setMarkerRef } = props;

  const handleClick = useCallback(() => onClick(poi), [onClick, poi]);
  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) => setMarkerRef(marker, poi.id),
    [setMarkerRef, poi.id]
  );

  return (
    <AdvancedMarker position={poi.location} ref={ref} onClick={handleClick}>
      <Pin
        background="var(--color-main)"
        glyphColor="var(--color-neutral-0)"
        borderColor="var(--color-main)"
      />
    </AdvancedMarker>
  );
};
