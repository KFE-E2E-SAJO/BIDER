import { useQuery } from '@tanstack/react-query';
import { getMessages } from '../api/getMessages';

export function useMessages(shortId: string) {
  return useQuery({
    queryKey: ['messages', shortId],
    queryFn: () => getMessages(shortId),
    staleTime: 1000 * 60 * 5,
  });
}
