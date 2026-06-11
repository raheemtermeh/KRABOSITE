import React, { useEffect, useRef } from "react";
import Script from "next/script";
import Head from "next/head";
import "../styles/loader.css";
import "../styles/globals.css";
import "../styles/product.css";
import "../styles/header.css";
import TopNav from "@components/Header/TopNav";
//= Scripts
import navbarScrollEffect from "@common/navbarScrollEffect";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps, home }) {
  const router = useRouter();
  const navbarRef = useRef(null);

  useEffect(() => {
    navbarScrollEffect(navbarRef.current);
  }, [navbarRef]);

  return (
    <>
      {/* Conditionally render TopNav only if the route is not '/login' */}
      {router.pathname !== "/login" && <TopNav style="4" rtl />}

      {/* Uncomment this block if you want to include the Navbar */}
      {/* {home.success === true && 
        <Navbar navbarRef={navbarRef} header={home.data.data.header} location={"home"} rtl />
      } */}

      <Head>
        <title>KRABO</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      <Component {...pageProps} />

      <Script
        strategy="beforeInteractive"
        src="/assets/js/lib/pace.js"
      ></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/lib/bootstrap.bundle.min.js"
      ></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/lib/mixitup.min.js"
      ></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/lib/wow.min.js"
      ></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/lib/html5shiv.min.js"
      ></Script>
      <Script strategy="lazyOnload" src="/assets/js/main.js"></Script>
    </>
  );
}

export default MyApp;

export async function getStaticProps() {
  try {
    const Home = await fetch("https://python.krabo.gold/ui/home/home");
    const result_Home = await Home.json();

    return {
      props: {
        home: {
          data: result_Home,
          success: true,
          error: false,
        },
      },
      revalidate: 60,
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        home: {
          success: false,
          error: true,
        },
      },
    };
  }
}
