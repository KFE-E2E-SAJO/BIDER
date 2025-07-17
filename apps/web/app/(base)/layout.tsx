import Header from '@/widgets/header/Header';
import Nav from '@/widgets/nav/Nav';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col pb-28">{children}</main>
      <Nav />
    </>
  );
};
export default BaseLayout;
