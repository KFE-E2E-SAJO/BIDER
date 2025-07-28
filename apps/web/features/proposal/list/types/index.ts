export interface ProposalContentsProps {
  filter: 'all' | 'pending' | 'accepted' | 'ended';
}

export interface ProposerParam {
  userId: string;
}

export interface ProposalListParams extends ProposerParam, ProposalContentsProps {}

export interface ProposalItem {
  proposal_id: string;
  auction_id: string;
  proposed_price: number;
  proposal_status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  responded_at: string | null;

  auction: {
    auction_id: string;
    product: {
      product_id: string;
      title: string;
      exhibit_user_id: string;
      product_image: { image_url: string }[];
    };
  };

  proposer_id: {
    user_id: string;
    nickname: string;
    profile_img: string | null;
  };
}

export interface ProposalDetailParams {
  userId: string;
  proposalId: string;
}
