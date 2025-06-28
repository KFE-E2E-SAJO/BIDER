import { Button } from '@repo/ui/components/Button/Button';

const Footer = () => {
  return (
    <div className="p-box h-35 bg-neutral-100 py-[11px]">
      <span className="typo-caption-regular text-neutral-600">
        ⓒ 2025 SAJO. All Right Reserved.
      </span>
      <Button variant="link" size="fit" className="typo-caption-regular ml-3">
        로그아웃
      </Button>
    </div>
  );
};

export default Footer;
