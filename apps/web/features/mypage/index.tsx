'use client';

import Footer from '@/widgets/footer/Footer';
import MyPageAuction from '@/features/mypage/ui/MyPageAuction';
import MyPageProfileCard from '@/features/mypage/ui/MypageProfileCard';
import MyPageMenuList from '@/features/mypage/ui/MyPageMenuList';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';
import { useGetProfile } from '@/features/mypage/model/useGetProfile';

const MyPage = () => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const { data, isLoading, error } = useGetProfile({ userId });

  if (isLoading || error || !data) return <Loading />;

  return (
    <div>
      <MyPageProfileCard {...data.profile} />
      <MyPageAuction {...data.auction} />
      <MyPageMenuList address={data.profile.address} />
      <Footer />
    </div>
  );
};

export default MyPage;
