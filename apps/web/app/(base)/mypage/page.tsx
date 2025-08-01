import MyPage from '@/features/mypage';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const MyPageRoute = () => {
  return (
    <ReactQueryProvider>
      <MyPage />
    </ReactQueryProvider>
  );
};

export default MyPageRoute;
