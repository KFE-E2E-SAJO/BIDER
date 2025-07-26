import { POINT_REASONS, PointReason } from '../types';

export const getPointValue = (reason: PointReason): number | null => {
  const matched = POINT_REASONS.find((r) => r.value === reason);
  return matched?.point ?? null;
};

export const getPointReasonLabel = (value: string): string => {
  const reason = POINT_REASONS.find((r) => r.value === value);
  return reason ? reason.label : '알 수 없음';
};
