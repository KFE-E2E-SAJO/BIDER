import { useMutation, useQueryClient } from '@tanstack/react-query';

const useRespondProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      proposalId,
      proposalStatus,
      userId,
    }: {
      proposalId: string;
      proposalStatus: 'accept' | 'reject';
      userId: string;
    }) => {
      const res = await fetch('/api/proposal/received-proposal/proposal-detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proposalId, proposalStatus, userId }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || '처리에 실패했습니다.');
      }
      return result;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['receivedProposalList', variables.userId, 'all'],
      });
    },
  });
};

export default useRespondProposal;
