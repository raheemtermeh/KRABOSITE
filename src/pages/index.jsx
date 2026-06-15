import { useEffect, useRef } from "react";
import Head from "next/head";
//= Scripts
import navbarScrollEffect from "@common/navbarScrollEffect";
//= Layout
import MainLayout from "@layouts/Main";
//= Components
import Navbar from "@components/Navbars/AppNav/kraboHeader";
import Footer from "@components/Footer/Footer";
import HomeSlider from "@components/HomeSlider";
import Projects from "@components/Home/Projects";
import Product from "@components/Home/ProductBox";
import FooterMobile from "@components/Navbars/AppNav/FooterMobile";
import CollectionList from "@components/collection/CollectionList";
import ProductList from "@components/listProduct/productList";
import FeatureList from "@components/Home/FeacureList";
import useFetchCartItems from "@components/Product/useFetchCartItems";
import ImageList from "@components/imageList/ImageList";
import GoldRangBox from "@components/GoldRangBox/GoldRangBox";
import ServiceBox from "@components/ServiceBox";

// --- تابع کمکی برای تلاش مجدد (Retry) ---
async function fetchWithRetry(url, retries = 3, delay = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      // اگر پاسخ سرور OK نبود (مثلاً 500 یا 503)، خطا پرتاب کن
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.warn(`تلاش ${i + 1} از ${retries} برای دریافت داده ناموفق بود.`, error.message);
      // اگر آخرین تلاش بود، خطا را به بیرون پرتاب کن
      if (i === retries - 1) throw error;
      // قبل از تلاش بعدی مقداری صبر کن (Delay)
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

const HomeAppLanding = ({ home }) => {
  const navbarRef = useRef(null);
  const totalItems = useFetchCartItems();

  useEffect(() => {
    if (document.querySelector("#cart-2")) {
      if (totalItems) {
        document.querySelector("#cart-2").setAttribute("data-totalitems", totalItems);
      }
    }
    navbarScrollEffect(navbarRef.current);
  }, [navbarRef, totalItems]);

  return (
    <>
      <Head>
        <title>گالری کرابو</title>
        <meta name="description" content="کرابو" />
        <meta property="og:title" content="گالری کرابو" />
        <meta
          property="og:description"
          content="خرید طلا از فروشگاه اینترنتی گالری طلا کرابو. خرید مجموعه متناسب با هر بودجه ای. فروش نقدی و اقساط انواع طلا"
        />
        <meta property="og:type" content="website" />
        <meta charSet="utf-8" />
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="googlebot" content="index,follow" />
        <meta property="og:site_name" content="گالری کرابو" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:url" content="https://krabo.gold" />
      </Head>
      <MainLayout isRTL>
        {home.success === true ? (
          <>
            <Navbar
              navbarRef={navbarRef}
              header={home.data.data.header}
              location={"home"}
              searchShow={true}
              rtl
            />
            <main className="blog-page style-5">
              <HomeSlider style="5" rtl slider={home.data.data.slider} />
              <ImageList />
              <ServiceBox />
              <ProductList header={home.data.data.header} />
              
              <Projects
                banner={home.data.data.box.filter((item) => {
                  return item.idd === "2019";
                })}
                boxNumber={3}
              />
            </main>
            <FooterMobile location={"home"} header={home.data.data.header} />
          </>
        ) : (
          // --- نمایش پیام خطا در صورت شکست تمام تلاش‌ها ---
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">مشکل در دریافت اطلاعات</h2>
            <p className="text-gray-600 mb-6">
              متأسفانه در حال حاضر امکان بارگذاری اطلاعات وجود ندارد. لطفاً صفحه را رفرش کنید یا لحظاتی دیگر مجدداً تلاش نمایید.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              تلاش مجدد (Refresh)
            </button>
          </div>
        )}

        <Footer rtl />
      </MainLayout>
    </>
  );
};

export default HomeAppLanding;

export async function getStaticProps() {
  const url = "https://python.krabo.gold/ui/home/home";
  try {
    // استفاده از تابع Retry با ۳ بار تلاش و تاخیر ۱.۵ ثانیه‌ای بین هر تلاش
    const result_Home = await fetchWithRetry(url, 3, 1500);
    
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
    console.error("خطای نهایی در دریافت داده‌های صفحه اصلی:", error);
    return {
      props: {
        home: {
          success: false,
          error: true,
        },
      },
      // حتی در صورت خطا هم revalidate می‌گذاریم تا سرور بک‌اند تحت فشار ریکوئست‌های مداوم قرار نگیرد
      revalidate: 60, 
    };
  }
}