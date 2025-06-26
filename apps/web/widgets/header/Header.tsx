import HeaderItem from './ui/HeaderItem';

const Header = () => {
  const hasNewAlert = true; //새로운 alert 여부 받아오기

  return (
    <header className="bg-neutral-0 fixed left-0 top-0 flex h-[67px] w-full items-baseline justify-between px-[16px] pb-[11px] pt-[28px]">
      <HeaderItem hasNewAlert={hasNewAlert} />
    </header>
  );
};

export default Header;
