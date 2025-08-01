import ProfileInputList from '@/features/mypage/edit/ui/ProfileInputList';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const EditProfile = async () => {
  return (
    <ReactQueryProvider>
      <div className="p-box">
        <ProfileInputList />
      </div>
    </ReactQueryProvider>
  );
};

export default EditProfile;
