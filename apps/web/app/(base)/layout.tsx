import Header from '@/widgets/header/Header';
import Nav from '@/widgets/nav/Nav';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="pb-27 flex flex-1 flex-col">{children}</main>
      <Nav />
    </>
  );
};
export default BaseLayout;
