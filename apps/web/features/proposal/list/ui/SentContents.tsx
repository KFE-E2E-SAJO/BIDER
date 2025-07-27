'use client';

import { ProposalContentsProps } from '@/features/proposal/list/types';
import Loading from '@/shared/ui/Loading/Loading';
import { useSentProposal } from '@/features/proposal/list/model/useSentProposal';
import { useAuthStore } from '@/shared/model/authStore';
import ProposalItemList from '@/features/proposal/list/ui/ProposalItemList';

const SentContents = ({ filter }: ProposalContentsProps) => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const { data, isLoading, error } = useSentProposal({ userId, filter });
  if (isLoading || error || !data) return <Loading />;

  return (
    <div className="p-box">
      <ProposalItemList data={data} />
    </div>
  );
};

export default SentContents;
