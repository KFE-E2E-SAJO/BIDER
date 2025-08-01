import ReceivedProposal from '@/features/proposal/list/ui/ReceivedProposal';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const ReceivedProposalPage = () => {
  return (
    <ReactQueryProvider>
      <ReceivedProposal />
    </ReactQueryProvider>
  );
};

export default ReceivedProposalPage;
