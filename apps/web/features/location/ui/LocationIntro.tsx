'use client';
import { useLocationStore } from '@/features/location/model/useLocationStore';
import DotStepper from '@/features/location/ui/DotStepper';
import { Button } from '@repo/ui/components/Button/Button';
import Image from 'next/image';

const LocationIntro = () => {
  const goNext = useLocationStore((state) => state.goNext);

  return (
    <>
      <div className="p-box flex flex-1 flex-col justify-center">
        <h2 className="typo-subtitle-medium mb-[16px] text-neutral-900">
          <span className="text-main">위치 설정</span>이 필요해요!
        </h2>
        <div className="typo-body-regular mb-[29px] text-neutral-700">
          <p>Bider는 지역 기반 서비스예요.</p>
          <p>위치를 설정하고 근처 경매 정보를 확인해 보세요.</p>
        </div>
        <DotStepper />
        <div className="flex justify-center">
          <Image src="/setLocation1.svg" alt="위치 아이콘" width={235} height={235} />
        </div>
      </div>
      <div className="bg-main h-24 pt-3">
        <Button onClick={goNext}>위치 설정 하러 가기</Button>
      </div>
    </>
  );
};

export default LocationIntro;
