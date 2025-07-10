import { Button } from '@repo/ui/components/Button/Button';
import { checkIsAuthenticated } from '../model/checkIsAuthenticated';
import { useRouter } from 'next/navigation';

type Props = {
  isMounted: boolean;
};

export const SplashStartButton = ({ isMounted }: Props) => {
  const router = useRouter();

  const handleStartClick = () => {
    if (!isMounted) return;

    const isAuthenticated = checkIsAuthenticated(isMounted);

    if (isAuthenticated) {
      const authStorage = localStorage.getItem('auth-storage');

      if (!authStorage) return false;
      const address = JSON.parse(authStorage).state.user.address;

      if (address && address !== 'null') {
        router.push('/');
      } else {
        router.push('/setLocation');
      }
    } else {
      router.push('/signup');
    }
  };

  return (
    <>
      <Button className="w-full" onClick={handleStartClick}>
        시작하기
      </Button>
    </>
  );
};
