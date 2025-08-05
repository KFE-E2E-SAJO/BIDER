import { useQueries } from '@tanstack/react-query';
import { getMessages } from '../api/getMessages';
import { getSystemMessage } from '../api/getSystemMessage';
import { CombinedMessage } from '../types';
import { useMemo } from 'react';

export function useCombinedMessages(shortId: string) {
  const results = useQueries({
    queries: [
      {
        queryKey: ['messages', shortId],
        queryFn: () => getMessages(shortId),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ['systemMessage', shortId],
        queryFn: () => getSystemMessage(shortId),
        staleTime: Infinity,
      },
    ],
  });
  const combinedMessages = useMemo(() => {
    const messages = results[0].data ?? [];
    const systemMsg = results[1].data;

    const userMessages: CombinedMessage[] = messages.map((msg) => ({
      ...msg,
      messageType: 'user' as const,
    }));

    const systemMessages: CombinedMessage[] = systemMsg
      ? [{ ...systemMsg, messageType: 'system' as const }]
      : [];

    const combined = [...userMessages, ...systemMessages];
    return combined.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [results]);

  return {
    combinedMessages,
    isLoading: results.some((r) => r.isLoading),
    error: results.find((r) => r.error)?.error ?? null,
  };
}
