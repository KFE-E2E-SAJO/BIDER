import { subscribeUser } from '@/app/actions';
import { useEffect, useState } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export const useCreatePushToken = (isChecked: boolean) => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isChecked) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    if (Notification.permission !== 'granted') return;

    const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapid) {
      console.error('VAPID 키 없음!');
      setMessage('푸시 키 누락');
      return;
    }

    async function registerPushToken() {
      try {
        const registration = await navigator.serviceWorker.ready;

        let sub = await registration.pushManager.getSubscription();
        if (!sub) {
          sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapid!),
          });
        }

        setSubscription(sub);

        const serializedSub = JSON.parse(JSON.stringify(sub));
        await subscribeUser(serializedSub);
      } catch (err) {
        console.error('푸시 구독 실패:', err);
      }
    }

    registerPushToken();
    setIsSupported(true);
  }, [isChecked]);

  return { isSupported, subscription, message };
};
