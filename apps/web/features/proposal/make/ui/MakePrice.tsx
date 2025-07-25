'use client';

import { Button } from '@repo/ui/components/Button/Button';
import { Input } from '@repo/ui/components/Input/Input';

const MakePrice = () => {
  return (
    <div className="p-box flex flex-col gap-[20px] pt-[35px]">
      <div>
        <div className="typo-subtitle-small-medium pb-[5px]">얼마로 제안할까요?</div>
        <p className="typo-caption-regular text-neutral-600">
          100포인트를 사용해 가격을 제안할 수 있어요.
        </p>
      </div>

      <div className="typo-body-medium flex w-full items-end justify-between gap-2">
        <Input
          inputStyle=""
          className=""
          value=""
          onChange={() => console.log('')}
          placeholder="희망하는 제안가를 적어주세요."
          required
        />
        원
      </div>
      <Button type="submit" disabled={false}>
        제안하기
      </Button>
    </div>
  );
};
export default MakePrice;
