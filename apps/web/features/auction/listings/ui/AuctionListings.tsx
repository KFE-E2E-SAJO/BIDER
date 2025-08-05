import AuctionTopTabs from '@/features/auction/shared/ui/AuctionTopTabs';
import { createClient } from '@/shared/lib/supabase/server';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';
import AuctionListingsTabs from '@/features/auction/listings/ui/AuctionListingsTabs';

const AuctionListings = async () => {
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
        <AuctionListingsTabs userId={userId} />
      </ReactQueryProvider>
    </>
  );
};

export default AuctionListings;
