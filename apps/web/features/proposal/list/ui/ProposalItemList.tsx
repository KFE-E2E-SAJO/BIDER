'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ProposalStatusBadge from '@/features/proposal/list/ui/ProposalStatusBadge';
import { ProposalItem } from '@/features/proposal/list/types';

const ProposalItemList = ({ data }: { data: ProposalItem[] }) => {
  const pathname = usePathname();
  return (
    <ul>
      {data.map((item) => {
        const isPendingReceived =
          item.proposal_status === 'pending' && pathname === '/mypage/proposal/received';

        const content = (
          <div className="flex gap-[19px]">
            <div className="relative size-[71px] overflow-hidden rounded">
              <Image
                src={item.auction.product.product_image?.[0]?.image_url ?? ''}
                alt={item.auction.product.title}
                fill
                sizes=""
                className="rounded-[3px] object-cover object-center"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between text-neutral-900">
              <div>{item.auction.product.title}</div>
              <div>
                <p className="text-[10px] text-neutral-600">받은 제안가</p>
                <div className="align-center flex">
                  <div className="typo-body-bold">
                    {item.proposed_price.toLocaleString()}
                    <span className="typo-caption-regular">원</span>
                  </div>
                  <ProposalStatusBadge status={item.proposal_status} />
                </div>
              </div>
            </div>
          </div>
        );

        return (
          <li
            key={item.proposal_id}
            className="border-b border-neutral-100 py-[20px] last:border-none"
          >
            {isPendingReceived ? (
              <Link href={`/mypage/proposal/received/${item.proposal_id}`}>{content}</Link>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ProposalItemList;
