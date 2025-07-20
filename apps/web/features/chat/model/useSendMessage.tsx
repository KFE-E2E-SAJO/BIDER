import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '../api/sendMessage';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      content,
      userId,
      chatroomId,
    }: {
      content: string;
      userId: string;
      chatroomId: string;
    }) => sendMessage(content, userId, chatroomId),

    onSuccess: (data, variables) => {
      // 메시지 전송 성공 시 메시지 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.chatroomId],
      });
    },

    onError: (error) => {
      console.error('메시지 전송 실패:', error);
    },
  });
};
