import { useEffect, useRef } from "react";
import axios from "axios";
import Head from "next/head";
//= Scripts
import navbarScrollEffect from "@common/navbarScrollEffect";
//= Layout
import MainLayout from "@layouts/Main";
//= Components
import Navbar from "@components/Navbars/AppNav/kraboHeader";
import ProductBox from "@components/Product/Detail/TabsContent";
import Footer from "@components/Footer/Footer";
import useFetchCartItems from "@components/Product/useFetchCartItems";
import FooterMobile from "@components/Navbars/AppNav/FooterMobile";
import { useRouter } from "next/router";
import { createGlobalStyle } from "styled-components";

// منوی استاتیک پیش‌فرض
const STATIC_MENU = {
  menu: [
    { title: "صفحه نخست", url: "/", menu_item: [] },
    { title: "گردنبند", url: "/product/necklaces", menu_item: [] },
    { title: "گوشواره", url: "/product/earrings", menu_item: [] },
    { title: "دستبند", url: "/product/bracelets", menu_item: [] },
    { title: "انگشتر", url: "/product/womens-gold-ring", menu_item: [] },
    { title: "آویز", url: "/product/watch-pendant", menu_item: [] },
  ],
  name: "home",
  idd: "home",
};

const PageFAQ = ({ product, header }) => {
  const navbarRef = useRef(null);
  const router = useRouter();
  const totalItems = useFetchCartItems();

  useEffect(() => {
    window.scrollTo(0, 0);
    navbarScrollEffect(navbarRef.current, true);
    if (!product.success || header.status === 404) {
      router.push("/404");
      return null;
    }
    if (document.querySelector("#cart-2")) {
      if (totalItems) {
        document
          .querySelector("#cart-2")
          .setAttribute("data-totalitems", totalItems);
      }
    }
  }, [navbarRef, totalItems, product.success, header.status, router]);

  // هدر استاتیک: اگر دیتا داشت از دیتا استفاده کن، وگرنه از منوی استاتیک
  const headerData =
    header?.data?.menu && header.data.menu.length > 0
      ? header.data
      : STATIC_MENU;

  const GlobalStyles = createGlobalStyle`
    .to_top {
      display: none!important;
    }
  `;

  if (!product.success) {
    return (
      <>
        <MainLayout isRTL>
          <Navbar navbarRef={navbarRef} header={STATIC_MENU} />
          <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-amber-50 to-white">
            <div className="w-12 h-12 border-3 border-[#8B0000]/10 border-t-[#8B0000] border-r-[#DAA520] rounded-full animate-spin"></div>
            <p className="mt-5 text-[#8B0000] font-medium">
              در حال بارگذاری...
            </p>
          </div>
          <Footer />
          <FooterMobile location="home" header={STATIC_MENU} />
        </MainLayout>
        <style jsx global>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 0.8s linear infinite;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:site_name" content="گالری کرابو" />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.data?.title_seo} />
        <meta property="og:url" content="https://krabo.gold" />
        <meta property="og:image" content={product.data?.image} />
        <link
          rel="canonical"
          href={`https://python.krabo.gold/api/product/${router.query.idCategory}/${router.query.idSubCategory}/${router.query.productId}/`}
        />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <title>{product.data?.title_seo}</title>
        <meta name="description" content={product.data?.description_seo} />
      </Head>

      <MainLayout isRTL>
        {/* هدر با دیتای دریافتی یا استاتیک */}
        <Navbar
          navbarRef={navbarRef}
          location="product"
          status={true}
          header={headerData}
        />

        <main className="faq-page style-5 section-padding" dir="ltr">
          {product.success && <ProductBox product={product} />}
        </main>
        <Footer />
        <FooterMobile location="home" header={headerData} />
      </MainLayout>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </>
  );
};

export default PageFAQ;

export async function getServerSideProps(context) {
  let product = { success: false, data: null };
  let header = { success: false, data: null };

  try {
    const { data } = await axios.get(
      `https://da.linooxel.com/kraboheader.json`,
      { timeout: 10000 },
    );
    header = {
      status: 200,
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Header fetch error:", error.message);
    header = {
      status: 500,
      message: error.message,
      success: false,
      data: null,
    };
  }

  try {
    const { data } = await axios.get(
      `https://python.krabo.gold/api/product/${context.params.idCategory}/${context.params.idSubCategory}/${context.params.productId}/`,
      { timeout: 15000 },
    );
    product = {
      status: 200,
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Product fetch error:", error.message);
    product = {
      status: error.response?.status || 500,
      message: error.message,
      success: false,
      data: null,
    };
  }

  return {
    props: {
      product: product,
      header: header,
    },
  };
}
