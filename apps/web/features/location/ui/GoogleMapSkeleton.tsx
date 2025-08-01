import Image from 'next/image';
const MAPAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const GoogleMapSkeleton = () => {
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=37.5642135,127.0016985&zoom=10&size=1200x300&key=${MAPAPIKEY}`;

  return (
    <div className="relative h-[300px] w-full animate-pulse">
      <Image
        src={staticMapUrl}
        alt="지도 로딩 중"
        fill
        className="object-cover opacity-50"
        priority
      />
    </div>
  );
};

export default GoogleMapSkeleton;
