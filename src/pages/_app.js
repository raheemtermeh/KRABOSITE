// ✅ این سه خط باید در بالای فایل باشند (قبل از هر ایمپورت دیگری)
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false; // جلوگیری از inject خودکار CSS که باعث تداخل می‌شود

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Head from "next/head";
import "../styles/loader.css";
import "../styles/globals.css";
import "../styles/product.css";
import "../styles/header.css";
import "../styles/factor-invoice.css";
import TopNav from "@components/Header/TopNav";
import navbarScrollEffect from "@common/navbarScrollEffect";
import { useRouter } from "next/router";

// ===== کامپوننت لودینگ مدرن =====
const ModernLoader = () => (
  <div className="modern-loader-overlay">
    <div className="modern-loader-card">
      <div className="modern-loader-spinner">
        <div className="modern-spinner-ring"></div>
        <div className="modern-spinner-ring"></div>
        <div className="modern-spinner-ring"></div>
        <div className="modern-spinner-core"></div>
      </div>
      <h3 className="modern-loader-title">KRABO</h3>
      <p className="modern-loader-text">در حال بارگذاری...</p>
      <div className="modern-loader-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const navbarRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navbarScrollEffect(navbarRef.current);

    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    const handleError = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  }, [router]);

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

      {isLoading && <ModernLoader />}

      <Script strategy="beforeInteractive" src="/assets/js/lib/pace.js" />
      <Script
        strategy="beforeInteractive"
        src="/assets/js/lib/bootstrap.bundle.min.js"
      />
      <Script
        strategy="beforeInteractive"
        src="/assets/js/lib/mixitup.min.js"
      />
      <Script strategy="beforeInteractive" src="/assets/js/lib/wow.min.js" />
      <Script
        strategy="beforeInteractive"
        src="/assets/js/lib/html5shiv.min.js"
      />
      <Script strategy="lazyOnload" src="/assets/js/main.js" />

      {/* ===== استایل‌های لودینگ + فیکس آیکون‌ها ===== */}
      <style jsx global>{`
        /* ✅ فیکس مشکل سایز بزرگ آیکون‌های FontAwesome */
        svg:not(:root) {
          overflow: hidden;
        }

        .svg-inline--fa:not(:root) {
          width: 1em;
          height: 1em;
          vertical-align: -0.125em;
        }

        /* استایل‌های لودینگ */
        .modern-loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 254, 249, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          animation: fadeIn 0.3s ease;
        }

        .modern-loader-card {
          background: white;
          padding: 50px 60px;
          border-radius: 28px;
          box-shadow: 0 25px 70px rgba(136, 10, 10, 0.15);
          text-align: center;
          border: 2px solid #f5e6c8;
          position: relative;
          animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          max-width: 380px;
          width: 90%;
        }

        .modern-loader-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #880a0a, #c9a961, #880a0a);
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
          border-radius: 28px 28px 0 0;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }

        .modern-loader-spinner {
          position: relative;
          width: 90px;
          height: 90px;
          margin: 0 auto 24px;
        }

        .modern-spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-radius: 50%;
          animation: modernSpin 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)
            infinite;
        }

        .modern-spinner-ring:nth-child(1) {
          border-top-color: #880a0a;
          border-right-color: #880a0a;
        }

        .modern-spinner-ring:nth-child(2) {
          border-top-color: #c9a961;
          border-left-color: #c9a961;
          animation-delay: -0.4s;
          width: 75%;
          height: 75%;
          top: 12.5%;
          left: 12.5%;
        }

        .modern-spinner-ring:nth-child(3) {
          border-bottom-color: #f5e6c8;
          border-right-color: #f5e6c8;
          animation-delay: -0.8s;
          width: 50%;
          height: 50%;
          top: 25%;
          left: 25%;
        }

        .modern-spinner-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          background: linear-gradient(135deg, #880a0a, #c9a961);
          border-radius: 50%;
          animation: pulseCore 1.5s ease-in-out infinite;
        }

        @keyframes modernSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulseCore {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0.6;
          }
        }

        .modern-loader-title {
          font-family: "Arial", sans-serif;
          color: #880a0a;
          font-size: 32px;
          font-weight: 300;
          letter-spacing: 8px;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #880a0a, #c9a961);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .modern-loader-text {
          color: #666;
          font-size: 14px;
          margin: 0 0 20px 0;
          font-weight: 500;
        }

        .modern-loader-dots {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .modern-loader-dots span {
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #c9a961, #880a0a);
          border-radius: 50%;
          animation: dotBounce 1.4s ease-in-out infinite;
        }

        .modern-loader-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .modern-loader-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes dotBounce {
          0%,
          60%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          30% {
            transform: scale(1.3);
            opacity: 1;
          }
        }

        @media (max-width: 480px) {
          .modern-loader-card {
            padding: 40px 30px;
          }
          .modern-loader-spinner {
            width: 75px;
            height: 75px;
          }
          .modern-loader-title {
            font-size: 26px;
            letter-spacing: 6px;
          }
        }
      `}</style>
    </>
  );
}

export default MyApp;
