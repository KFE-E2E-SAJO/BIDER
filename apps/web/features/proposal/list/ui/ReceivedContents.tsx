'use client';

import { ProposalListParams } from '@/features/proposal/list/types';
import Loading from '@/shared/ui/Loading/Loading';
import { useReceivedProposal } from '@/features/proposal/list/model/useReceivedProposal';
import ProposalItemList from '@/features/proposal/list/ui/ProposalItemList';

const ReceivedContents = ({ filter, userId }: ProposalListParams) => {
  const { data, isLoading, error } = useReceivedProposal({ userId, filter });
  if (isLoading || error || !data) return <Loading />;

  return (
    <div className="p-box">
      <ProposalItemList data={data} />
    </div>
  );
};

export default ReceivedContents;
