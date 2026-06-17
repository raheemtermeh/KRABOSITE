// _app.js - نسخه تمیز و بدون getStaticProps
import React, { useEffect, useRef } from "react";
import Script from "next/script";
import Head from "next/head";
import "../styles/loader.css";
import "../styles/globals.css";
import "../styles/product.css";
import "../styles/header.css";
import TopNav from "@components/Header/TopNav";
import navbarScrollEffect from "@common/navbarScrollEffect";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const navbarRef = useRef(null);

  useEffect(() => {
    navbarScrollEffect(navbarRef.current);
  }, [navbarRef]);

  return (
    <>
      {router.pathname !== "/login" && <TopNav style="4" rtl />}

      <Head>
        <title>KRABO</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      <Component {...pageProps} />

      <Script strategy="beforeInteractive" src="/assets/js/lib/pace.js" />
      <Script strategy="beforeInteractive" src="/assets/js/lib/bootstrap.bundle.min.js" />
      <Script strategy="beforeInteractive" src="/assets/js/lib/mixitup.min.js" />
      <Script strategy="beforeInteractive" src="/assets/js/lib/wow.min.js" />
      <Script strategy="beforeInteractive" src="/assets/js/lib/html5shiv.min.js" />
      <Script strategy="lazyOnload" src="/assets/js/main.js" />
    </>
  );
}

export default MyApp;