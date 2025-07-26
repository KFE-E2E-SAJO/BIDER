'use client';
import Line from '@/shared/ui/Line/Line';
import { Handshake, Heart, Hourglass, MessagesSquare, Swords, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type AlarmItem = {
  id: number;
  strokeColor: string;
  contents: string;
  time: string;
  image: string;
};

const Alarm = () => {
  const [alarm, setAlarms] = useState<AlarmItem[]>([
    {
      id: 1,
      strokeColor: '#7676EE',
      contents: '입찰 금액이 갱신되었습니다. 다시 입찰해보세요!',
      time: '11시간 전',
      image: '/alarm_thumb.png',
    },
  ]);

  return (
    <ul className="p-box flex flex-col pt-[23px]">
      {alarm.map((alarm, index) => (
        <li>
          <div className="flex items-start">
            <Hourglass className="shrink-0 pt-[4px]" size={22} stroke={alarm.strokeColor} />
            <div className="ml-[10px] mr-[27px]">
              <p className="typo-body-regular mb-[3px] text-neutral-900">{alarm.contents}</p>
              <span className="typo-caption-regular text-neutral-400">{alarm.time}</span>
            </div>
            <Image src={alarm.image} alt="" width={50} height={50} className="rounded-sm" />
          </div>
          <Line className="my-[15px]" />
        </li>
      ))}
    </ul>
  );
};

export default Alarm;
