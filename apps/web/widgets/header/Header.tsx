import HeaderItem from '@/widgets/header/ui/HeaderItem';

const Header = () => {
  const hasNewAlert = false; //새로운 alert 여부 받아오기

  return (
    <header className="bg-neutral-0 p-box sticky left-0 top-0 z-50 flex h-[67px] w-full items-baseline justify-between pb-[11px] pt-[28px]">
      <HeaderItem hasNewAlert={hasNewAlert} />
    </header>
  );
};

export default Header;
