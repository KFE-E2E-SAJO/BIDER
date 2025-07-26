'use client';

import Link from 'next/link';
import { encodeUUID } from '@/shared/lib/shortUuid';

const ProposalActionButton = ({ auctionId }: { auctionId: string }) => {
  return (
    <>
      <Link
        href={`/auction/${encodeUUID(auctionId)}/proposal`}
        className="typo-body-medium border border-neutral-300 px-[15px] py-[5px]"
      >
        제안하기
      </Link>
    </>
  );
};
export default ProposalActionButton;
