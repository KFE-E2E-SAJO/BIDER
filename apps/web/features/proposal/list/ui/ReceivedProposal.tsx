import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import ProposalTopTabs from '@/features/proposal/list/ui/ProposalTopTabs';

const ReceivedProposal = () => {
  const items = [
    { value: 'all', label: '전체', content: '전체' },
    { value: 'pending', label: '제안 대기', content: '제안 대기' },
    { value: 'accepted', label: '제안 수락', content: '제안 수락' },
    { value: 'ended', label: '종료', content: '종료' },
  ];
  return (
    <div>
      <ProposalTopTabs />
      <Tabs defaultValue="all" items={items} className="py-[16px]" />
    </div>
  );
};

export default ReceivedProposal;
