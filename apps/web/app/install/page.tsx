'use client';

import { Button } from '@repo/ui/components/Button/Button';
import { useState, useEffect } from 'react';

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-2 text-xl font-semibold">Bider 설치하기</h3>
      <Button>Add to Home Screen</Button>
      {isIOS && (
        <>
          <p className="mb-2 font-medium">iOS에서 설치하려면:</p>
          <Button
            onClick={() =>
              alert('Safari에서 공유 버튼 ⬆️ 을 누른 후 "홈 화면에 추가"를 선택하세요.')
            }
          >
            📲 홈 화면에 추가 방법 보기
          </Button>
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="p-4">
      <InstallPrompt />
    </div>
  );
}
