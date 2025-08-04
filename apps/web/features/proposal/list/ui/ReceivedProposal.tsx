import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import ProposalTopTabs from '@/features/proposal/list/ui/ProposalTopTabs';
import ReceivedContents from '@/features/proposal/list/ui/ReceivedContents';
import getUserId from '@/shared/lib/getUserId';

const ReceivedProposal = async () => {
  const userId = await getUserId();

  const items = [
    { value: 'all', label: '전체', content: <ReceivedContents filter="all" userId={userId} /> },
    {
      value: 'pending',
      label: '제안 대기',
      content: <ReceivedContents filter="pending" userId={userId} />,
    },
    {
      value: 'accepted',
      label: '제안 수락',
      content: <ReceivedContents filter="accepted" userId={userId} />,
    },
    { value: 'ended', label: '종료', content: <ReceivedContents filter="ended" userId={userId} /> },
  ];
  return (
    <div>
      <ProposalTopTabs />
      <Tabs defaultValue="all" items={items} className="py-[16px]" />
    </div>
  );
};

export default ReceivedProposal;
