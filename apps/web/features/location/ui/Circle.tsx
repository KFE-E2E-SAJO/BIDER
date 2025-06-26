'use client';

import { useEffect, useRef, useContext } from 'react';
import { GoogleMapsContext } from '@vis.gl/react-google-maps';

export interface CircleProps {
  center: google.maps.LatLngLiteral;
  radius: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  fillColor?: string;
  fillOpacity?: number;
}

const Circle = ({
  center,
  radius,
  strokeColor = '#0c4cb3',
  strokeOpacity = 1,
  strokeWeight = 3,
  fillColor = '#3b82f6',
  fillOpacity = 0.3,
}: CircleProps) => {
  const { map } = useContext(GoogleMapsContext) ?? {};
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map) return;
    circleRef.current?.setMap(null);
    const Newcircle = new google.maps.Circle({
      map,
      center,
      radius,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      fillColor,
      fillOpacity,
    });

    circleRef.current = Newcircle;

    return () => {
      Newcircle.setMap(null);
    };
  }, [map, center, radius, strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity]);

  return null;
};

export default Circle;
