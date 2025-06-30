import { Button } from '@repo/ui/components/Button/Button';

const Footer = () => {
  // 로그인 세션명 받아서 처리 getSession()함수 생성 필요
  const logout = async () => {
    'use server';
    // const session = await getSession();
    // await session.destroy();
    // redirect('/splash')
  };

  return (
    <div className="p-box h-35 bg-neutral-100 py-[11px]">
      <span className="typo-caption-regular text-neutral-600">
        ⓒ 2025 SAJO. All Right Reserved.
      </span>
      <form action={logout} className="inline">
        <Button variant="link" size="fit" className="typo-caption-regular ml-3">
          로그아웃
        </Button>
      </form>
    </div>
  );
};

export default Footer;
