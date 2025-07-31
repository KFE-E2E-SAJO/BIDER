import AuctionTopTabs from '@/features/auction/shared/ui/AuctionTopTabs';
import { createClient } from '@/shared/lib/supabase/server';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';
import AuctionBidsTabs from '@/features/auction/bids/ui/AuctionBidsTabs';

const AuctionBids = async () => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user.id;

  if (!userId) return;

  return (
    <>
      <AuctionTopTabs />
      <ReactQueryProvider>
        <AuctionBidsTabs userId={userId} />
      </ReactQueryProvider>
    </>
  );
};
export default AuctionBids;
