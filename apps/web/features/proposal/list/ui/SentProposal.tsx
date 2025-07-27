import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import ProposalTopTabs from '@/features/proposal/list/ui/ProposalTopTabs';
import SentContents from './SentContents';

const SentProposal = () => {
  const items = [
    { value: 'all', label: '전체', content: <SentContents filter="all" /> },
    { value: 'pending', label: '제안 대기', content: <SentContents filter="pending" /> },
    { value: 'accepted', label: '제안 수락', content: <SentContents filter="accepted" /> },
    { value: 'ended', label: '종료', content: <SentContents filter="ended" /> },
  ];
  return (
    <div>
      <ProposalTopTabs />
      <Tabs defaultValue="all" items={items} className="py-[16px]" />
    </div>
  );
};

export default SentProposal;
