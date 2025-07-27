import { getUserLocation } from '@/features/location/api/getUserLocation';
import { LocationWithAddress } from '@/features/location/types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useGetUserLocation = (
  userId: string,
  options?: Partial<UseQueryOptions<LocationWithAddress>>
) => {
  return useQuery({
    queryKey: ['userLocation', userId],
    queryFn: () => getUserLocation(userId),
    enabled: !!userId,
    ...options,
  });
};
