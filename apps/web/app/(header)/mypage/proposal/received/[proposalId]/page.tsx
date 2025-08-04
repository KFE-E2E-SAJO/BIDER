import ProposalDetail from '@/features/proposal/list/ui/ProposalDetail';
import getUserId from '@/shared/lib/getUserId';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const ProposalDetailPage = async () => {
  const userId = await getUserId();
  return (
    <ReactQueryProvider>
      <ProposalDetail userId={userId} />
    </ReactQueryProvider>
  );
};

export default ProposalDetailPage;
