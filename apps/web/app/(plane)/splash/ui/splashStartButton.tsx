import { Button } from '@repo/ui/components/Button/Button';
import { useRouter } from 'next/navigation';

export const SplashStartButton = () => {
  const router = useRouter();

  const handleStartClick = () => {
    router.push('/signup');
  };

  return (
    <>
      <Button className="w-full" onClick={handleStartClick}>
        시작하기
      </Button>
    </>
  );
};
