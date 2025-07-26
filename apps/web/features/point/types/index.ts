import { Point } from '@/entities/point/model/types';

export interface PointListProps {
  filter: 'all' | 'earn' | 'use';
  data: Point[];
}

export const POINT_REASONS = [
  {
    label: '거래완료(구매자)',
    value: 'deal_complete_buyer',
    point: null, // 거래금액의 % 동적 계산
    type: 'earn',
  },
  {
    label: '거래완료(출품자)',
    value: 'deal_complete_seller',
    point: 300,
    type: 'earn',
  },
  {
    label: '거래 후기 작성',
    value: 'write_review',
    point: 100,
    type: 'earn',
  },
  {
    label: '회원 가입',
    value: 'signup',
    point: 500,
    type: 'earn',
  },
  {
    label: '경매 금액 제안',
    value: 'bid_propose',
    point: -100,
    type: 'use',
  },
  {
    label: '시크릿 경매 최고가 금액 확인',
    value: 'secret_bid_view',
    point: -500,
    type: 'use',
  },
  {
    label: '닉네임 변경',
    value: 'nickname_change',
    point: -100,
    type: 'use',
  },
] as const;

export type PointReason = (typeof POINT_REASONS)[number]['value'];

export type PointReasonType = 'earn' | 'use';

export type PointItemProps = {
  data: Point;
};
