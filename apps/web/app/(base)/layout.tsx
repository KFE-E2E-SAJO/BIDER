import Header from '@/widgets/header/Header';
import Nav from '@/widgets/nav/Nav';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Nav />
    </>
  );
};
export default BaseLayout;
