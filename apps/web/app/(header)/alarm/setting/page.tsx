'use client';
import { useCreatePushToken } from '@/features/alarm/setting/model/useCreatePushToken';
import { useAlarmSetting } from '@/features/alarm/setting/useAlarmSetting';
import { Switch } from '@repo/ui/components/Switch/Switch';

const AlarmSetting = () => {
  const {
    isAuctionChecked,
    isChatChecked,
    isPointChecked,
    isGradeChecked,
    isStarChecked,
    setIsAuctionChecked,
    setIsChatChecked,
    setIsPointChecked,
    setIsGradeChecked,
    setIsStarChecked,
  } = useAlarmSetting();

  const checked =
    isAuctionChecked || isChatChecked || isPointChecked || isGradeChecked || isStarChecked;

  useCreatePushToken(checked);

  return (
    <div className="m-6 flex flex-col space-y-8">
      <div className="block flex justify-between">
        <p className="typo-body-regular flex">경매 관련 알림</p>
        <Switch
          className="flex"
          checked={isAuctionChecked}
          onCheckedChange={setIsAuctionChecked}
        ></Switch>
      </div>
      <div className="flex justify-between">
        <p className="typo-body-regular">새로운 채팅 알림</p>
        <Switch checked={isChatChecked} onCheckedChange={setIsChatChecked}></Switch>
      </div>
      <div className="flex justify-between">
        <p className="typo-body-regular">포인트 알림</p>
        <Switch checked={isPointChecked} onCheckedChange={setIsPointChecked}></Switch>
      </div>
      <div className="flex justify-between">
        <p className="typo-body-regular">등급 알림</p>
        <Switch checked={isGradeChecked} onCheckedChange={setIsGradeChecked}></Switch>
      </div>
      <div className="flex justify-between">
        <p className="typo-body-regular">별점 알림</p>
        <Switch checked={isStarChecked} onCheckedChange={setIsStarChecked}></Switch>
      </div>
    </div>
  );
};

export default AlarmSetting;
