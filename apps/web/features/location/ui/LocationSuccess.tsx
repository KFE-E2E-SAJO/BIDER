import DotStepper from '@/features/location/ui/DotStepper';
import { Button } from '@repo/ui/components/Button/Button';
import Image from 'next/image';
import Link from 'next/link';

const LocationSuccess = () => (
  <>
    <div className="p-box flex flex-1 flex-col justify-center">
      <h2 className="typo-subtitle-medium mb-[16px]">
        <span className="text-main">축하합니다!</span>
      </h2>
      <div className="typo-body-regular mb-[29px] text-neutral-700">
        <p>내 동네 설정이 성공적으로 완료되었습니다.</p>
        <p>지금 바로 Bider를 시작해 보세요!</p>
      </div>
      <DotStepper activeIndex={2} />
      <div className="flex justify-center">
        <Image src="/setLocation2.svg" alt="축하합니다" width={235} height={235} />
      </div>
    </div>
    <div className="bg-main h-24 pt-3">
      <Link href="/">
        <Button>시작하기</Button>
      </Link>
    </div>
  </>
);

export default LocationSuccess;
