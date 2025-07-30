export type PushAlarmType = 'auction' | 'point' | 'review' | 'chat';

export type AuctionPushAlarmType =
  | 'bid'
  | 'bidUpdated'
  | 'auctionWon'
  | 'proposalSent'
  | 'proposalAccepted'
  | 'proposalRejected'
  | 'auctionStarted'
  | 'bidNotification'
  | 'auctionEndedWon'
  | 'auctionEndedLost'
  | 'proposalRequest';

export interface PushAlarmData {
  productName?: string;
  productId?: string;
  price?: number;
  nickname?: string;
  level?: string;
  amount?: number;
  auctionId?: string;
  image?: string;
  chatroomId?: string;
}

type PushAlarmKey = `${PushAlarmType}:${string}`;

const pushAlarmMessage: Record<
  PushAlarmKey,
  (data: PushAlarmData) => { title: string; body: string; link: string; image?: string }
> = {
  // 예시: auction 알림
  'auction:bid': (data) => ({
    title: '입찰 완료',
    body: `${data.productName}에 ${data.price}원으로 입찰되었습니다.`,
    link: `/product/${data.productId}`,
    image: `${data.image}`,
  }),
  'auction:bidUpdated': (data) => ({
    title: '입찰 금액 갱신',
    body: `${data.productName}의 입찰 금액이 갱신되었습니다. 다시 입찰해보세요.`,
    link: `/product/${data.productId}`,
    image: `${data.image}`,
  }),
  'auction:auctionWon': (data) => ({
    title: '경매 낙찰 성공',
    body: `축하합니다! ${data.productName}을 낙찰받았습니다. 지금 ${data.nickname}님과 대화를 시작해 보세요.`,
    link: `/chat/${data.chatroomId}`,
    image: `${data.image}`,
  }),
  'auction:proposalAccepted': (data) => ({
    title: '제안 수락',
    body: `${data.productName}에 대한 제안이 수락되었습니다. ${data.nickname}님과 대화를 시작해보세요.`,
    link: `/chat/${data.chatroomId}`,
    image: `${data.image}`,
  }),
  'auction:auctionStarted': (data) => ({
    title: '경매 시작',
    body: `${data.productName}의 경매가 시작되었습니다!`,
    link: `/auction/${data.auctionId}`,
    image: `${data.image}`,
  }),
  'auction:bidNotification': (data) => ({
    title: '입찰 발생 알림',
    body: `${data.nickname}님이 ${data.productName}에 ${data.price}원으로 입찰했어요!`,
    link: `/auction/${data.auctionId}`,
    image: `${data.image}`,
  }),
  'auction:auctionEndedWon': (data) => ({
    title: '경매 종료 - 낙찰',
    body: `${data.productName}의 경매가 종료 되었습니다. ${data.nickname}님과 대화를 시작해보세요.`,
    link: `/chat/${data.chatroomId}`,
    image: `${data.image}`,
  }),
  'auction:auctionEndedLost': (data) => ({
    title: '경매 종료 - 유찰',
    body: `${data.productName}의 경매가 종료 되었습니다.`,
    link: '/auction/listings',
    image: `${data.image}`,
  }),
  'auction:proposalRequest': (data) => ({
    title: '제안 요청 확인',
    body: `${data.nickname}님이 ${data.productName}에 ${data.price}원으로 제안했어요! 제안을 확인해 보세요.`,
    link: `/mypage/proposal/received`,
    image: `${data.image}`,
  }),

  // 포인트
  'point:pointAdded': (data) => ({
    title: '포인트 적립',
    body: `${data.amount} 포인트가 적립되었습니다.`,
    link: '/mypage/point',
    image: `${data.image}`,
  }),
  'point:pointUsed': (data) => ({
    title: '포인트 사용',
    body: `${data.amount} 포인트가 사용되었습니다.`,
    link: '/mypage/point',
    image: `${data.image}`,
  }),

  // 별점
  'review:newReview': (data) => ({
    title: '새 별점 도착',
    body: `${data.nickname}님이 별점을 등록했습니다.`,
    link: '/review',
    image: `${data.image}`,
  }),

  // 채팅
  'chat:newMessage': (data) => ({
    title: '새 메시지 도착',
    body: `${data.nickname}님이 메시지를 보냈습니다. 확인해보세요.`,
    link: `/chat/${data.chatroomId}`,
    image: `${data.image}`,
  }),
};

export function getPushAlarmMessage(type: PushAlarmType, subType: string, data: PushAlarmData) {
  const key = `${type}:${subType}` as PushAlarmKey;
  const generator = pushAlarmMessage[key];

  if (data.image) {
  }

  if (!generator) {
    return {
      title: '알림',
      body: '새로운 알림이 도착했습니다.',
      link: '/',
      image: '',
    };
  }
  const result = generator(data);
  return {
    title: result.title,
    body: result.body,
    link: result.link,
    ...(result.image ? { image: result.image } : {}),
  };
}
