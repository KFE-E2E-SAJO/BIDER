'use client';

import { useEffect } from 'react';

export default function PushBootstrap() {
  useEffect(() => {
    async function registerSW() {
      if (!('serviceWorker' in navigator)) return;

      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        console.log('서비스워커 등록 성공:', registration);
      } catch (err) {
        console.error('서비스워커 등록 실패:', err);
      }
    }

    registerSW();
  }, []);

  return null;
}
