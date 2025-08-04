'use client';

import { useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';

const GoogleMapAdjustCenter = () => {
  const map = useMap();
  const isFirstLoad = useRef(true);
  const PAN_OFFSET_RATIO = 0.2; // 높이 비율 (20% 위로)

  const adjustCenter = () => {
    map?.panBy(0, window.innerHeight * PAN_OFFSET_RATIO);
  };

  useEffect(() => {
    if (!map) return;

    const idleListener = map.addListener('idle', () => {
      if (isFirstLoad.current) {
        adjustCenter();
        isFirstLoad.current = false;
      }
    });

    let lastZoom = map.getZoom();
    const zoomListener = map.addListener('zoom_changed', () => {
      const currentZoom = map.getZoom();

      if (currentZoom !== undefined && lastZoom !== undefined && currentZoom > lastZoom) {
        const tempIdle = map.addListener('idle', () => {
          adjustCenter();
          tempIdle.remove();
        });
      }

      lastZoom = currentZoom;
    });

    return () => {
      idleListener.remove();
      zoomListener.remove();
    };
  }, [map]);

  return null;
};

export default GoogleMapAdjustCenter;
