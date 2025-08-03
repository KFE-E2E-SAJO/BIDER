'use client';

import React from 'react';
import ChatInputBar from '@/features/chat/room/ui/ChatInputBar';
import AuctionInfo from '@/features/chat/room/ui//AuctionInfo';
import MessageList from '@/features/chat/room/ui//MessageList';
import Loading from '@/shared/ui/Loading/Loading';
import { useAuctionInfo } from '../model/useAuctionInfo';
import { useIsChatEnd } from '../../list/model/useIsChatEnd';

const ChatPageContent = ({ shortId }: { shortId: string }) => {
  const { data, isLoading, error } = useAuctionInfo(shortId);
  const {
    data: isChatEndData,
    isLoading: isChatEndLoading,
    error: isChatEndError,
  } = useIsChatEnd(shortId);

  const isChatEnd = isChatEndData ?? false;

  if (isLoading || isChatEndLoading) return <Loading />;
  if (error) return <p>오류: {(error as Error).message}</p>;
  if (isChatEndError) return <p>채팅 종료 여부 확인 오류: {(isChatEndError as Error).message}</p>;
  if (!data) {
    return <p>경매 정보를 조회할 수 없습니다.</p>;
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      {/* 경매 상품 설명 */}
      <AuctionInfo data={data} />

      {/* 채팅 내역 */}
      <MessageList shortId={shortId} isChatEnd={isChatEnd} />

      {/* 채팅입력칸 */}
      <ChatInputBar shortId={shortId} isChatEnd={isChatEnd} />
    </div>
  );
};

export default ChatPageContent;
