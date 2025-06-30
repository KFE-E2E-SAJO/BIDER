import { redirect } from 'next/navigation';
import ProfileInputList from './ui/ProfileInputList';
import { supabase } from '@/shared/lib/supabaseClient';

const EditProfile = async () => {
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
    .select('user_id, nickname, profile_img')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    redirect('/splash');
  }

  return (
    <div className="p-box">
      <ProfileInputList
        userId={data.user_id}
        nickname={data.nickname}
        profileImg={data.profile_img}
      />
    </div>
  );
};

export default EditProfile;
