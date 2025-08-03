import { useQuery } from '@tanstack/react-query';
import { fetchIsChatEnd } from '../api/fetchIsChatEnd';

export const useIsChatEnd = (shortId: string) => {
  return useQuery<boolean, Error>({
    queryKey: ['chatRoom_active', shortId],
    queryFn: () => fetchIsChatEnd(shortId),
    enabled: !!shortId,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
