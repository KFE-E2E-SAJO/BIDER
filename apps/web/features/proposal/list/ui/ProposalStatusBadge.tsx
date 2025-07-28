import { PROPOSAL_STATUS } from '@/shared/consts/proposalStatus';

const ProposalStatusBadge = ({ status }: { status: string }) => {
  let bgColor = '',
    textColor = '',
    text = '';
  switch (status) {
    case PROPOSAL_STATUS.ACCEPTED:
      bgColor = 'main-lighter';
      textColor = 'main';
      text = '제안 수락';
      break;
    case PROPOSAL_STATUS.PENDING:
      bgColor = 'warning-light';
      ((textColor = 'warning-medium'), (text = '제안 대기'));
      break;
    case PROPOSAL_STATUS.EXPIRED:
      bgColor = 'neutral-300';
      ((textColor = 'neutral-700'), (text = '종료'));
      break;
    case PROPOSAL_STATUS.REJECTED:
      bgColor = 'neutral-300';
      ((textColor = 'neutral-700'), (text = '종료'));
      break;
  }

  return (
    <span
      className={`bg-${bgColor} text-${textColor} ml-[10px] inline-flex h-fit w-fit items-center justify-center px-2 py-1 text-[10px] font-semibold`}
    >
      {text}
    </span>
  );
};

export default ProposalStatusBadge;
