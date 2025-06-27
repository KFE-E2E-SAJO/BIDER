import { decodeShortId } from '@/shared/lib/shortUuid';
import { supabase } from '@/shared/lib/supabaseClient';
import { notFound } from 'next/navigation';
import ProductImageSlider from './ProductImageSlider';

const ProductDetailPage = async ({ params }: { params: { shortId: string } }) => {
  // test용 shorId  = uRMUuxqfyznoNTZhFmvhx4
  const param = await params;
  const uuid = decodeShortId(param.shortId);

  const { data, error } = await supabase
    .from('auction')
    .select(
      `
            *,
            product (
            *,
            exhibit_user:exhibit_user_id (
                *
            ),
            product_image (
                *
            )
            )
        `
    )
    .eq('auction_id', uuid)
    .single();

  if (error || !data) return notFound();

  const auction = data;
  const mapped = {
    auctionId: auction.auction_id,
    productTitle: auction.product?.title,
    productDescription: auction.product?.description,
    sellerName: auction.product?.exhibit_user?.username,
    images: auction.product?.product_image ?? [],
    minPrice: auction.min_price,
  };

  return (
    <main>
      <ProductImageSlider images={mapped.images} />
    </main>
  );
};

export default ProductDetailPage;
