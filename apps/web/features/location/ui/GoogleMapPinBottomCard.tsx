'use client';

import Image from 'next/image';
import Link from 'next/link';
import { encodeUUID } from '@/shared/lib/shortUuid';
import { AuctionMarkerResponse } from '@/features/auction/list/types';
import { X } from 'lucide-react';
import StatusBadge from '@/shared/ui/badge/StatusBadge';
import { getCountdownWithColor } from '@/features/product/lib/utils';

interface GoogleMapPinBottomCardProps {
  product: AuctionMarkerResponse;
  onClose: () => void;
}

const GoogleMapPinBottomCard = ({ product, onClose }: GoogleMapPinBottomCardProps) => {
  return (
    <div
      className="bg-neutral-0 animate-slide-up fixed left-[50%] flex w-[90%] max-w-[400px] translate-x-[-50%] items-start justify-between overflow-hidden rounded-xl shadow-lg"
      style={{ bottom: 'calc(10% + 100px)' }}
    >
      <Link href={`/auction/${encodeUUID(product.id)}`} className="flex gap-2">
        <div className="relative h-[100px] w-[100px]">
          <Image src={product.thumbnail} alt={''} fill className="object-cover" />
        </div>
        <div className="flex max-w-[200px] flex-1 flex-col justify-between px-[8px] py-[10px]">
          <div>
            <p className="typo-caption-regular overflow-hidden text-ellipsis whitespace-nowrap">
              {product.title}
            </p>
            <div className="typo-subtitle-small-medium mt-[3px]">
              {product.highestBid?.toLocaleString()}
              <span className="typo-body-regular ml-[2px]">원</span>
            </div>
          </div>
          <StatusBadge
            type={'time-blue'}
            label={getCountdownWithColor(product.auctionEndAt).text}
          />
        </div>
      </Link>
      <button className="cursor-pointer p-[10px] text-gray-400" onClick={onClose}>
        <X />
      </button>
    </div>
  );
};

export default GoogleMapPinBottomCard;
