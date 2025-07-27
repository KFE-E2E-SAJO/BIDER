'use client';

import { ProposalContentsProps } from '@/features/proposal/list/types';
import Loading from '@/shared/ui/Loading/Loading';
import { useReceivedProposal } from '../model/useReceivedProposal';
import { useAuthStore } from '@/shared/model/authStore';
import Link from 'next/link';
import Image from 'next/image';
import ProposalStatusBadge from './ProposalStatusBadge';

const ReceivedContents = ({ filter }: ProposalContentsProps) => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const { data, isLoading, error } = useReceivedProposal({ userId, filter });
  if (isLoading || error || !data) return <Loading />;

  console.log(data);

  return (
    <div className="p-box">
      <ul>
        {data.map((item) => (
          <li
            key={item.proposal_id}
            className="border-b border-neutral-100 py-[20px] last:border-none"
          >
            <Link href={`/mypage/proposal/received/${item.proposal_id}`}>
              <div className="flex gap-[19px]">
                <div className="relative size-[71px] overflow-hidden rounded">
                  <Image
                    src={item.auction.product.product_image?.[0]?.image_url ?? ''}
                    alt={item.auction.product.title}
                    fill
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
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceivedContents;
