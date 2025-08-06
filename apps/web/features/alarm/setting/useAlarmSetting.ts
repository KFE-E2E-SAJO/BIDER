import { useState } from 'react';

export const useAlarmSetting = () => {
  const [isAuctionChecked, setIsAuctionChecked] = useState(true);
  const [isChatChecked, setIsChatChecked] = useState(true);
  const [isPointChecked, setIsPointChecked] = useState(true);
  const [isGradeChecked, setIsGradeChecked] = useState(true);
  const [isStarChecked, setIsStarChecked] = useState(true);

  return {
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
  };
};
