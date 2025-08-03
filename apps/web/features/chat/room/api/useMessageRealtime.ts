import { useCallback, useEffect } from 'react';
import { anonSupabase } from '@/shared/lib/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import { decodeShortId } from '@/shared/lib/shortUuid';
import { useAuthStore } from '@/shared/model/authStore';
import { MessageWithProfile } from '@/entities/message/model/types';
import { RealtimeMessagePayload } from '../types';
import { Profiles } from '@/entities/profiles/model/types';

export const useMessageRealtime = (chatRoomId: string) => {
  const queryClient = useQueryClient();
  const fullChatRoomId = decodeShortId(chatRoomId);
  const userId = useAuthStore((state) => state.user?.id) as string;

  // 캐시 직접 업데이트 함수
  const updateMessageCache = useCallback(
    async (payload: RealtimeMessagePayload) => {
      const queryKey = ['messages', chatRoomId];

      if (payload.eventType === 'INSERT') {
        // payload.new는 Message 타입만 가지고 있으므로, profile 정보를 직접 가져와야 함
        const rawMessage = payload.new as MessageWithProfile;
        if (!rawMessage) {
          console.warn('INSERT 페이로드에 새 메시지 데이터가 없습니다.');
          return;
        }

        let messageWithProfile: MessageWithProfile = rawMessage;

        // sender_id를 사용하여 profiles 테이블에서 프로필 정보 가져오기
        if (rawMessage.sender_id) {
          try {
            const { data: profileData, error: profileError } = await anonSupabase
              .from('profiles')
              .select('profile_img, nickname') // 필요한 프로필 필드만 선택
              .eq('user_id', rawMessage.sender_id)
              .single();

            if (profileError) {
              console.error('프로필 정보 가져오기 에러:', profileError);
            } else if (profileData) {
              messageWithProfile = {
                ...rawMessage,
                profile: profileData as Profiles, // 가져온 프로필 데이터를 할당
              };
            }
          } catch (e) {
            console.error('프로필 가져오기 비동기 에러:', e);
          }
        }

        // 새 메시지 추가
        queryClient.setQueryData(queryKey, (oldData: MessageWithProfile[] | undefined) => {
          if (!oldData) {
            queryClient.invalidateQueries({ queryKey });
            return oldData;
          }

          // 중복 방지
          const exists = oldData.some((msg) => msg.message_id === messageWithProfile.message_id);
          if (exists) {
            return oldData;
          }

          return [...oldData, messageWithProfile];
        });
      } else if (payload.eventType === 'UPDATE') {
        // 메시지 업데이트 (읽음 상태 등)
        queryClient.setQueryData(queryKey, (oldData: MessageWithProfile[] | undefined) => {
          if (!oldData) {
            queryClient.invalidateQueries({ queryKey });
            return oldData;
          }

          const updatedMessage = payload.new as MessageWithProfile;

          const updatedData = oldData.map((msg) =>
            msg.message_id === updatedMessage.message_id ? { ...msg, ...updatedMessage } : msg
          );

          return updatedData;
        });
      }
    },
    [queryClient, chatRoomId]
  );

  useEffect(() => {
    // userId가 없으면 구독하지 않음
    if (!userId || !fullChatRoomId) {
      return;
    }

    const channel = anonSupabase.channel(`message-${fullChatRoomId}`);

    channel.on(
      'postgres_changes' as any,
      {
        event: '*',
        schema: 'public',
        table: 'message',
        filter: `chatroom_id=eq.${fullChatRoomId}`,
      },
      async (payload: RealtimeMessagePayload) => {
        // payload 타입 명시
        const isInsert = payload.eventType === 'INSERT';
        const isUpdate = payload.eventType === 'UPDATE';

        // payload.new가 존재하고, 그 안에 sender_id가 있는지 확인
        const isMyMessage = payload.new?.sender_id === userId;

        if (isInsert || (isUpdate && isMyMessage)) {
          await updateMessageCache(payload);
        }
      }
    );

    channel.subscribe();

    return () => {
      anonSupabase.removeChannel(channel);
    };
  }, [chatRoomId, fullChatRoomId, queryClient, userId]);
};
