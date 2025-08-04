'use client';

import Image from 'next/image';
import Link from 'next/link';
import { encodeUUID } from '@/shared/lib/shortUuid';
import { AuctionMarkerResponse } from '@/features/auction/list/types';
import { X } from 'lucide-react';

interface GoogleMapPinBottomCardProps {
  product: AuctionMarkerResponse;
  onClose: () => void;
}

const GoogleMapPinBottomCard = ({ product, onClose }: GoogleMapPinBottomCardProps) => {
  return (
    <div className="bg-neutral-0 animate-slide-up fixed bottom-[21dvh] left-[50%] w-[90%] max-w-[400px] translate-x-[-50%] rounded-xl shadow-lg">
      <div className="flex gap-2">
        <div className="relative h-24 w-24 overflow-hidden rounded-md">
          <Image src={product.thumbnail} alt={''} fill className="object-cover" />
        </div>
        <div className="flex flex-1 flex-col justify-between p-[10px]">
          {/* <p>{product.title}</p> */}
          <Link href={`/auction/${encodeUUID(product.id)}`} className="text-main font-semibold">
            상세 보기 →
          </Link>
        </div>
      </div>
      <button className="absolute right-2 top-2 cursor-pointer text-gray-400" onClick={onClose}>
        <X />
      </button>
    </div>
  );
};

export default GoogleMapPinBottomCard;
