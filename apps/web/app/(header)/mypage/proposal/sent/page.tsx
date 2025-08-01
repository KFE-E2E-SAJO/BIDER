import SentProposal from '@/features/proposal/list/ui/SentProposal';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const SentProposalPage = () => {
  return (
    <ReactQueryProvider>
      <SentProposal />
    </ReactQueryProvider>
  );
};

export default SentProposalPage;
