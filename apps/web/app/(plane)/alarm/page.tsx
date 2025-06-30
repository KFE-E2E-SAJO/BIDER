import Line from '@/shared/ui/Line/Line';
import { Handshake, Heart, Hourglass, MessagesSquare, Swords, Trophy } from 'lucide-react';
import Image from 'next/image';

const Alarm = () => {
  return (
    <ul className="p-box flex flex-col pt-[23px]">
      <li>
        <div className="flex items-start">
          <Hourglass className="shrink-0 pt-[4px]" size={22} stroke="#7676EE" />
          <div className="ml-[10px] mr-[27px]">
            <p className="typo-body-regular mb-[3px] text-neutral-900">
              ‘스타우브 아시아볼...’의 경매가 곧 종료됩니다.
            </p>
            <span className="typo-caption-regular text-neutral-400">11시간 전</span>
          </div>
          <Image src="/alarm_thumb.png" alt="" width={50} height={50} className="rounded-sm" />
        </div>
        <Line className="my-[15px]" />
      </li>

      <li>
        <div className="flex items-start">
          <Swords className="shrink-0 pt-[4px]" size={22} stroke="#63CB7C" />
          <div className="ml-[10px] mr-[27px]">
            <p className="typo-body-regular mb-[3px] text-neutral-900">
              입찰 금액이 갱신되었습니다. 다시 입찰해보세요!
            </p>
            <span className="typo-caption-regular text-neutral-400">11시간 전</span>
          </div>
          <Image src="/alarm_thumb.png" alt="" width={50} height={50} className="rounded-sm" />
        </div>
        <Line className="my-[15px]" />
      </li>

      <li>
        <div className="flex items-start">
          <Trophy className="shrink-0 pt-[4px]" size={22} stroke="#FFCF51" />
          <div className="ml-[10px] mr-[27px]">
            <p className="typo-body-regular mb-[3px] text-neutral-900">
              축하합니다! ‘스타우브 아시아볼...’을 낙찰받았습니다. 지금 출품자 입찰매니아님과 대화를
              시작해보세요!
            </p>
            <span className="typo-caption-regular text-neutral-400">11시간 전</span>
          </div>
          <Image src="/alarm_thumb.png" alt="" width={50} height={50} className="rounded-sm" />
        </div>
        <Line className="my-[15px]" />
      </li>

      <li>
        <div className="flex items-start">
          <Handshake className="shrink-0 pt-[4px]" size={22} stroke="#F198CE" />
          <div className="ml-[10px] mr-[27px]">
            <p className="typo-body-regular mb-[3px] text-neutral-900">
              ‘스타우브 아시아볼...’의 경매가 종료되었습니다! 지금 낙찰자 입찰매니아님과 대화를
              시작해보세요!
            </p>
            <span className="typo-caption-regular text-neutral-400">11시간 전</span>
          </div>
          <Image src="/alarm_thumb.png" alt="" width={50} height={50} className="rounded-sm" />
        </div>
        <Line className="my-[15px]" />
      </li>

      <li>
        <div className="flex items-start">
          <MessagesSquare className="shrink-0 pt-[4px]" size={22} stroke="#61CEEB" />
          <div className="ml-[10px] mr-[27px]">
            <p className="typo-body-regular mb-[3px] text-neutral-900">
              입찰매니아님이 메시지를 보냈어요. 지금 확인해보세요!
            </p>
            <span className="typo-caption-regular text-neutral-400">11시간 전</span>
          </div>
          <Image src="/alarm_thumb.png" alt="" width={50} height={50} className="rounded-sm" />
        </div>
        <Line className="my-[15px]" />
      </li>

      <li>
        <div className="flex items-start">
          <Heart className="shrink-0 pt-[4px]" size={22} stroke="#F2597F" />
          <div className="ml-[10px] mr-[27px]">
            <p className="typo-body-regular mb-[3px] text-neutral-900">
              내가 올린 ‘스타우브 아시아볼...’게시글이 새로운 관심을 받았어요!
            </p>
            <span className="typo-caption-regular text-neutral-400">11시간 전</span>
          </div>
          <Image src="/alarm_thumb.png" alt="" width={50} height={50} className="rounded-sm" />
        </div>
        <Line className="my-[15px]" />
      </li>
    </ul>
  );
};

export default Alarm;
