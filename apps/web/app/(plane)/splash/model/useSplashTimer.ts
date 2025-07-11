import { useEffect, useState } from 'react';

export const useSplashTimer = (delay = 2000) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasShownSplash = localStorage.getItem('hasShownSplash');

    if (hasShownSplash === 'true') {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      localStorage.setItem('hasShownSplash', 'true');
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isLoading;
};
