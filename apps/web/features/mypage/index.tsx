'use client';

import Footer from '@/widgets/footer/Footer';
import MyPageAuction from '@/features/mypage/ui/MyPageAuction';
import MyPageProfileCard from '@/features/mypage/ui/MypageProfileCard';
import MyPageMenuList from '@/features/mypage/ui/MyPageMenuList';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';
import { useGetProfile } from '@/features/mypage/model/useGetProfile';

const MyPage = () => {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, error } = useGetProfile({ userId: user?.id ?? '' });

  if (!user?.id || error || isLoading || !data) {
    return <Loading />;
  }

  return (
    <div>
      <MyPageProfileCard
        nickname={data.nickname}
        email={data.email}
        profileImg={data.profile_img}
      />
      <MyPageAuction />
      <MyPageMenuList address={data.address} />
      <Footer />
    </div>
  );
};

export default MyPage;
