import ProposalDetail from '@/features/proposal/list/ui/ProposalDetail';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';
import getUserId from '@/shared/lib/getUserId';

const ProposalDetailPage = async () => {
  const userId = await getUserId();
  return (
    <ReactQueryProvider>
      <ProposalDetail userId={userId} />
    </ReactQueryProvider>
  );
};

export default ProposalDetailPage;
