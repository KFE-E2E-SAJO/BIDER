import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import ProposalTopTabs from '@/features/proposal/list/ui/ProposalTopTabs';
import ReceivedContents from './ReceivedContents';

const ReceivedProposal = () => {
  const items = [
    { value: 'all', label: '전체', content: <ReceivedContents filter="all" /> },
    { value: 'pending', label: '제안 대기', content: <ReceivedContents filter="pending" /> },
    { value: 'accepted', label: '제안 수락', content: <ReceivedContents filter="accepted" /> },
    { value: 'ended', label: '종료', content: <ReceivedContents filter="ended" /> },
  ];
  return (
    <div>
      <ProposalTopTabs />
      <Tabs defaultValue="all" items={items} className="py-[16px]" />
    </div>
  );
};

export default ReceivedProposal;
