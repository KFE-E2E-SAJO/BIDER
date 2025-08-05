import HeaderItem from '@/widgets/header/ui/HeaderItem';

const Header = () => {
  return (
    <header className="bg-neutral-0 p-box sticky left-0 top-0 z-50 flex h-[67px] w-full items-baseline justify-between pb-[11px] pt-[28px]">
      <HeaderItem />
    </header>
  );
};

export default Header;
