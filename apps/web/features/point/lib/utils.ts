import { POINT_REASONS, PointReason } from '../types';

export const getPointValue = (reason: PointReason, context?: { bidAmount?: number }): number => {
  const reasonItem = POINT_REASONS.find((r) => r.value === reason);

  if (!reasonItem) throw new Error('유효하지 않은 reason입니다.');

  if (reasonItem.point === null) {
    return calculateDynamicPoint(reason, context);
  }

  return reasonItem.point;
};

export const getPointReasonLabel = (value: string): string => {
  const reason = POINT_REASONS.find((r) => r.value === value);
  return reason ? reason.label : '알 수 없음';
};

const validReasons = POINT_REASONS.map((r) => r.value);

export const validateReason = (reason: string): reason is PointReason => {
  return validReasons.includes(reason as PointReason);
};

const calculateDynamicPoint = (reason: PointReason, context?: { bidAmount?: number }): number => {
  if (reason === 'deal_complete_buyer') {
    if (!context?.bidAmount) throw new Error('bidAmount가 필요합니다.');

    return Math.floor(context.bidAmount * 0.01);
  }
  return 0;
};
