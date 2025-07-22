import { getUserLocation } from '@/features/location/api/getUserLocation';
import { Location } from '@/features/location/types';
import { useQuery } from '@tanstack/react-query';

export const useGetUserLocation = (userId: string) => {
  return useQuery({
    queryKey: ['userLocation'],
    queryFn: () => getUserLocation(userId),
    enabled: !!userId,
  });
};
