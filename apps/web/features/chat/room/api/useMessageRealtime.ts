import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { decodeShortId } from '@/shared/lib/shortUuid';
import { useAuthStore } from '@/shared/model/authStore';
import { MessageWithImage } from '@/entities/message/model/types';
import { RealtimeMessagePayload } from '../types';
import { Profiles } from '@/entities/profiles/model/types';
import { createClient } from '@/shared/lib/supabase/client';
import { anonSupabase } from '@/shared/lib/supabaseClient';
import { MessageImage } from '@/entities/messageImage/model/types';

export const useMessageRealtime = (chatRoomId: string) => {
  const queryClient = useQueryClient();
  const fullChatRoomId = decodeShortId(chatRoomId);
  const userId = useAuthStore((state) => state.user?.id) as string;
  const supabase = createClient();

  // 캐시 직접 업데이트 함수
  const updateMessageCache = useCallback(
    async (payload: RealtimeMessagePayload) => {
      const queryKey = ['messages', chatRoomId];

      if (payload.eventType === 'INSERT') {
        // payload.new는 Message 타입만 가지고 있으므로, profile 정보를 직접 가져와야 함
        const rawMessage = payload.new as MessageWithImage;
        if (!rawMessage) {
          console.warn('INSERT 페이로드에 새 메시지 데이터가 없습니다.');
          return;
        }

        let newMessage: typeof rawMessage & Partial<{ profile: Profiles; images: MessageImage[] }> =
          { ...rawMessage };

        // 상대 프로필과 이미지 데이터를 병렬로 가져오기
        const profilePromise =
          rawMessage.sender_id !== userId
            ? anonSupabase
                .from('profiles')
                .select('profile_img, nickname')
                .eq('user_id', rawMessage.sender_id)
                .single()
            : Promise.resolve({ data: null, error: null });

        const imagePromise =
          rawMessage.message_type === 'image'
            ? supabase
                .from('message_image')
                .select('*')
                .eq('message_id', rawMessage.message_id)
                .order('order_index')
            : Promise.resolve({ data: null, error: null });

        try {
          const [profileResult, imageResult] = await Promise.all([profilePromise, imagePromise]);

          if (profileResult.data) {
            newMessage.profile = profileResult.data as Profiles;
          }
          if (imageResult.data) {
            newMessage.images = imageResult.data as MessageImage[];
          }
        } catch (e) {
          console.error('메시지 추가 데이터 가져오기 에러:', e);
        }

        // 새 메시지 추가
        queryClient.setQueryData(queryKey, (oldData: MessageWithImage[] | undefined) => {
          if (!oldData) {
            queryClient.invalidateQueries({ queryKey });
            return oldData;
          }

          // 중복 방지
          const exists = oldData.some((msg) => msg.message_id === newMessage.message_id);
          if (exists) {
            return oldData;
          }

          return [...oldData, newMessage];
        });
      } else if (payload.eventType === 'UPDATE') {
        // 메시지 업데이트 (읽음 상태 등)
        queryClient.setQueryData(queryKey, (oldData: MessageWithImage[] | undefined) => {
          if (!oldData) {
            queryClient.invalidateQueries({ queryKey });
            return oldData;
          }

          const updatedMessage = payload.new as MessageWithImage;

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

    const channel = supabase.channel(`message-${fullChatRoomId}`);

    // 1. message 테이블 변경 감지
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

        if (isInsert) {
          await updateMessageCache(payload);
        } else if (isUpdate) {
          // UPDATE의 경우 내 메시지만 처리 (읽음 상태 등)
          const isMyMessage = payload.new?.sender_id === userId;
          if (isMyMessage) {
            await updateMessageCache(payload);
          }
        }
      }
    );

    // 2. chat_room 테이블 UPDATE 감지 (채팅방 종료 상태 변경)
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE', // UPDATE 이벤트 감지
        schema: 'public',
        table: 'chat_room',
        filter: `chatroom_id=eq.${fullChatRoomId}`, // 현재 채팅방의 상태 변경만 감지
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ['chatRoom_active', chatRoomId] });
      }
    );

    // 3. system_message 테이블 INSERT 감지
    channel.on(
      'postgres_changes' as any,
      {
        event: 'INSERT',
        schema: 'public',
        table: 'system_message',
        filter: `chatroom_id=eq.${fullChatRoomId}`,
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ['systemMessage', chatRoomId] });
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatRoomId, fullChatRoomId, queryClient, userId]);
};
