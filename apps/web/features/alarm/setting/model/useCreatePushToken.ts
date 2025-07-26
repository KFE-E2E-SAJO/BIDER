import { subscribeUser } from '@/app/actions';
import { useEffect, useState } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const useCreatePushToken = (isChecked: boolean) => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isChecked) return;

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }

    async function registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        const sub = await registration.pushManager.getSubscription();

        if (sub === null) {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
          });

          setSubscription(subscription);

          const serializedSub = JSON.parse(JSON.stringify(subscription));
          await subscribeUser(serializedSub);
        } else {
          setSubscription(sub);
          const serializedSub = JSON.parse(JSON.stringify(sub));
          await subscribeUser(serializedSub);
        }
      } catch (err) {
        console.error('서비스 등록 실패:', err);
        setMessage('푸시 알림 등록 실패');
      }
    }
  }, [isChecked]);

  return { isSupported, subscription, message };
};
