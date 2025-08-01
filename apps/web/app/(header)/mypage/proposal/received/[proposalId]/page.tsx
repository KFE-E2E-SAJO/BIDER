import ProposalDetail from '@/features/proposal/list/ui/ProposalDetail';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const ProposalDetailPage = () => {
  return (
    <ReactQueryProvider>
      <ProposalDetail />
    </ReactQueryProvider>
  );
};

export default ProposalDetailPage;
