import Header from '@/widgets/header/Header';

const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
export default HeaderLayout;
