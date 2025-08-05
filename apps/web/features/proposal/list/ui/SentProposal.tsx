import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import ProposalTopTabs from '@/features/proposal/list/ui/ProposalTopTabs';
import SentContents from '@/features/proposal/list/ui/SentContents';
import getUserId from '@/shared/lib/getUserId';

const SentProposal = async () => {
  const userId = await getUserId();
  const items = [
    { value: 'all', label: '전체', content: <SentContents filter="all" userId={userId} /> },
    {
      value: 'pending',
      label: '제안 대기',
      content: <SentContents filter="pending" userId={userId} />,
    },
    {
      value: 'accepted',
      label: '제안 수락',
      content: <SentContents filter="accepted" userId={userId} />,
    },
    { value: 'ended', label: '종료', content: <SentContents filter="ended" userId={userId} /> },
  ];
  return (
    <div>
      <ProposalTopTabs />
      <Tabs defaultValue="all" items={items} className="py-[16px]" />
    </div>
  );
};

export default SentProposal;
