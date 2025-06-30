import Footer from '@/widgets/footer/Footer';
import MyPageAuction from '@/features/tempMypage/ui/MyPageAuction';
import MyPageProfileCard from '@/features/tempMypage/ui/MypageProfileCard';
import MyPageMenuList from '@/features/tempMypage/ui/MyPageMenuList';
import { redirect } from 'next/navigation';
import { supabase } from '@/shared/lib/supabaseClient';

const MyPage = async () => {
  // 로그인 세션 정보 받아서 재수정
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  const user = { id: 'c6d80a1e-b154-4cd0-b17d-c7308c46ebaa' };

  if (!user) {
    redirect('/splash');
  }

  const { data, error } = await supabase
    .from('user')
    .select('user_id, email, nickname, profile_img, address')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    redirect('/splash');
  }

  return (
    <div>
      <MyPageProfileCard
        nickname={data.nickname}
        email={data.email}
        profileImg={data.profile_img}
      />
      <MyPageAuction />
      {/* 경매 개수 받기 */}
      <MyPageMenuList address={data.address} />
      <Footer />
    </div>
  );
};

export default MyPage;
