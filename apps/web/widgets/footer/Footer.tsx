'use client';

import { Button } from '@repo/ui/components/Button/Button';
import { useRouter } from 'next/navigation';
import { supabase } from '@/shared/lib/supabaseClient';
import { useAuthStore } from '@/shared/model/authStore';

const Footer = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    router.replace('/splash/welcome');
  };

  return (
    <div className="p-box h-35 bg-neutral-100 py-[11px]">
      <span className="typo-caption-regular text-neutral-600">
        ⓒ 2025 SAJO. All Right Reserved.
      </span>
      <Button
        onClick={handleLogout}
        variant="link"
        size="fit"
        className="typo-caption-regular ml-3"
      >
        로그아웃
      </Button>
    </div>
  );
};

export default Footer;
