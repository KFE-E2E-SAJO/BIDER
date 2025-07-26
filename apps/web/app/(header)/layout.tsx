import Header from '@/widgets/header/Header';

const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col pb-[40px]">{children}</main>
    </>
  );
};
export default HeaderLayout;
