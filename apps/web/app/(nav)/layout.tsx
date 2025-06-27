import Header from '@/widgets/header/Header';
import Nav from '@/widgets/nav/Nav';

const NavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Nav />
    </>
  );
};
export default NavLayout;
