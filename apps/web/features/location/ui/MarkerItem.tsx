import type { Marker } from '@googlemaps/markerclusterer';
import React, { useCallback } from 'react';
import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { AuctionMarkerResponse } from '@/features/auction/list/types';

export type MarkerProps = {
  poi: AuctionMarkerResponse;
  isSelected: boolean;
  onClick: (poi: AuctionMarkerResponse) => void;
  setMarkerRef: (marker: Marker | null, key: string) => void;
};

/**
 * Wrapper Component for an AdvancedMarker for a single tree.
 */
export const MarkerItem = (props: MarkerProps) => {
  const { poi, isSelected, onClick, setMarkerRef } = props;

  const handleClick = useCallback(() => onClick(poi), [onClick, poi]);
  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) => setMarkerRef(marker, poi.id),
    [setMarkerRef, poi.id]
  );

  return (
    <AdvancedMarker position={poi.location} ref={ref} onClick={handleClick}>
      <Pin
        background={isSelected ? 'var(--color-main-text)' : 'var(--color-main)'}
        glyphColor="var(--color-neutral-0)"
        borderColor={isSelected ? 'var(--color-main-text)' : 'var(--color-main)'}
      />
    </AdvancedMarker>
  );
};
