import { useEffect, useRef } from 'react';
import Head from 'next/head';
//= Scripts
// import navbarScrollEffect from "@common/navbarScrollEffect";
//= Layout
import MainLayout from '@layouts/Main';
//= Components
// import AbsoluteContainer from '@components/Navbars/AbsoluteContainer';
// import TopNav from '@components/Navbars/TopNav';
// import Navbar from '@components/Navbars/SaasNav';
import NotFound from '@components/404';;

const Page404 = () => {
  const navbarRef = useRef(null);

  useEffect(() => {
    navbarScrollEIteckffect(navbarRef.current, true);
  }, [navbarRef]);

  return (
    <>
      <Head>
        <title>krabo - 404</title>
      </Head>

      <MainLayout>
        404
        {/* <AbsoluteContainer> */}
          {/* <TopNav style="5" /> */}
          {/* <Navbar navbarRef={navbarRef} /> */}
        {/* </AbsoluteContainer> */}
        <main className="erorr-404-page style-5">
          <NotFound />
        </main>
      </MainLayout>
    </>
  )
}

export default Page404;