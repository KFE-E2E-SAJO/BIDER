'use client';

import { useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

const GoogleMapAdjustCenter = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const listener = map.addListener('idle', () => {
      map.panBy(0, window.innerHeight * 0.2);
      listener.remove();
    });

    return () => {
      listener.remove();
    };
  }, [map]);

  return null;
};
export default GoogleMapAdjustCenter;
