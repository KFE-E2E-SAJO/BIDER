import { Location } from '@/features/location/types';

export const getKoreanAddress = async (coords: Location): Promise<string | null> => {
  const { lat, lng } = coords;
  const res = await fetch(`/api/vworld?point=${lng},${lat}`);

  const data = await res.json();

  if (data?.response.status !== 'OK') {
    console.error('vworld 주소 조회 오류');
    return null;
  }

  const results = data.response.result;

  const structure = results[0].structure;
  const eupmyeondong = structure?.level4L; //읍면동

  return eupmyeondong;
};
