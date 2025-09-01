'use client';

import { useEffect, useState } from 'react';
import { useCreatePushToken } from '@/features/alarm/setting/model/useCreatePushToken';

const hasNotification = () => typeof window !== 'undefined' && 'Notification' in window;

type Props = { enabledDefault: boolean };

export default function GlobalPushGate({ enabledDefault }: Props) {
  const [showPrompt, setShowPrompt] = useState(false);

  // 권한 안전 조회
  const permission = hasNotification() ? window.Notification.permission : 'default';
  // 권한 허용 + 설정 ON이면 자동 구독
  const enabledNow = enabledDefault && permission === 'granted';
  const { message /*, requestPermission*/ } = useCreatePushToken(enabledNow);

  useEffect(() => {
    if (enabledDefault && hasNotification() && window.Notification.permission === 'default') {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [enabledDefault]);

  const onEnableClick = async () => {
    if (!hasNotification()) return;
    const p = await window.Notification.requestPermission();
    if (p === 'granted') setShowPrompt(false);
    // 권한이 'granted'가 되면 enabledNow가 true로 평가되어 훅이 자동 구독
  };

  return null;
}
