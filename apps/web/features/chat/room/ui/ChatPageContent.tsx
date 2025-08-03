'use client';

import React from 'react';
import ChatInputBar from '@/features/chat/room/ui/ChatInputBar';
import AuctionInfo from '@/features/chat/room/ui//AuctionInfo';
import MessageList from '@/features/chat/room/ui//MessageList';
import Loading from '@/shared/ui/Loading/Loading';
import { useAuctionInfo } from '../model/useAuctionInfo';

const ChatPageContent = ({ shortId }: { shortId: string }) => {
  const { data, isLoading, error } = useAuctionInfo(shortId);

  if (isLoading) return <Loading />;
  if (error) return <p>오류: {(error as Error).message}</p>;
  if (!data) {
    return <p>경매 정보를 조회할 수 없습니다.</p>;
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      {/* 경매 상품 설명 */}
      <AuctionInfo data={data} />

      {/* 채팅 내역 */}
      <MessageList shortId={shortId} />

      {/* 채팅입력칸 */}
      <ChatInputBar shortId={shortId} />
    </div>
  );
};

export default ChatPageContent;
