import Footer from '@/widgets/footer/Footer';
import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { Button } from '@repo/ui/components/Button/Button';
import { ChevronRight, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';
import MyPageAuction from './ui/MyPageAuction';
import StatusBadge from '@/shared/ui/badge/StatusBadge';
import MyPageProfileCard from './ui/MypageProfileCard';
import MyPageMenuList from './ui/MyPageMenuList';

const MyPage = () => {
  return (
    <div>
      <MyPageProfileCard />
      <MyPageAuction />
      <MyPageMenuList />
      <Footer />
    </div>
  );
};

export default MyPage;
