import EditProfile from '@/features/mypage/edit';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const EditProfileRoute = () => {
  return (
    <ReactQueryProvider>
      <EditProfile />
    </ReactQueryProvider>
  );
};

export default EditProfileRoute;
