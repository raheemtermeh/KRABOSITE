import { useEffect, useRef } from "react";
import axios from "axios";
import Head from "next/head";
//= Scripts
import navbarScrollEffect from "@common/navbarScrollEffect";
//= Layout
import MainLayout from "@layouts/Main";
//= Components
import Navbar from "@components/Navbars/AppNav/kraboHeader";
import Footer from "@components/Footer/Footer";
import useFetchCartItems from "@components/Product/useFetchCartItems";
import { useRouter } from "next/router";
import FooterMobile from "@components/Navbars/AppNav/FooterMobile";
import Product3 from "@components/Product/Category/Product3";

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

const Index = ({ category, header }) => {
  const router = useRouter();
  const navbarRef = useRef(null);
  const totalItems = useFetchCartItems();

  useEffect(() => {
    navbarScrollEffect(navbarRef.current, true);

    if (document.querySelector("#cart-2")) {
      if (totalItems) {
        document
          .querySelector("#cart-2")
          .setAttribute("data-totalitems", totalItems);
      }
    }

    if (!category.success || header.status === 404 || !category.data) {
      router.push("/404");
      return null;
    }
  }, [
    navbarRef,
    totalItems,
    router,
    header.status,
    category.success,
    category.data,
  ]);

  // هدر استاتیک: اگر دیتا داشت از دیتا استفاده کن، وگرنه از منوی استاتیک
  const headerData =
    header?.data?.menu && header.data.menu.length > 0
      ? header.data
      : STATIC_MENU;

  if (!category.data || !category.data.category_detail) {
    return (
      <>
        <MainLayout isRTL>
          {/* هدر استاتیک در حالت لودینگ */}
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
      <Head>
        <title>
          {category.data.category_detail?.title_seo || "گالری کرابو"}
        </title>
        <meta
          name="description"
          content={
            category.data.category_detail?.description_seo ||
            "خرید طلا از گالری کرابو"
          }
        />
        <meta
          property="og:title"
          content={category.data.category_detail?.title_seo || "گالری کرابو"}
        />
        <meta
          property="og:description"
          content={
            category.data.category_detail?.description_seo ||
            "خرید طلا از گالری کرابو"
          }
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
        {/* هدر با دیتای دریافتی یا استاتیک */}
        <Navbar navbarRef={navbarRef} header={headerData} />

        <main className="category-main">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-[#8B0000] to-[#6B0000] py-16 md:py-20 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full bg-repeat bg-[length:60px] animate-slowMove"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23DAA520' d='M50,15 L60,40 L85,40 L65,58 L75,85 L50,68 L25,85 L35,58 L15,40 L40,40 Z'/%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>
            <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-6 text-center">
              <div className="inline-block bg-white/15 backdrop-blur-sm px-5 py-2 rounded-full mb-6 text-sm text-[#DAA520] font-medium tracking-wide">
                ✨ مجموعه طلا و جواهر
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                {category.data.category_detail?.name || "دسته بندی محصولات"}
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 md:w-16 h-px bg-gradient-to-r from-transparent to-[#DAA520]"></div>
                <span className="text-2xl text-[#DAA520]">⚜️</span>
                <div className="w-12 md:w-16 h-px bg-gradient-to-l from-transparent to-[#DAA520]"></div>
              </div>
              <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
                بهترین و زیباترین طرح‌های طلا و جواهر با ضمانت اصالت و کیفیت
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white border-b border-[#8B0000]/10 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-5 md:px-6 py-6 md:py-8">
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-[#8B0000]">
                    {category.data.sub_categories?.length || 0}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 mt-1 font-medium">
                    دسته‌بندی
                  </div>
                </div>
                <div className="w-px h-8 md:h-10 bg-gradient-to-b from-transparent via-[#DAA520] to-transparent"></div>
                {/* <div className="text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-[#8B0000]">
                    {category.data.sub_categories?.reduce(
                      (acc, cat) => acc + (cat.item_count || 0),
                      0,
                    ) || 0}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 mt-1 font-medium">
                    محصول
                  </div>
                </div> */}
                <div className="w-px h-8 md:h-10 bg-gradient-to-b from-transparent via-[#DAA520] to-transparent"></div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-[#8B0000]">
                    ۱۰۰%
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 mt-1 font-medium">
                    تضمین کیفیت
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-gradient-to-br from-amber-50 to-white py-12 md:py-16">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 relative inline-block after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-14 after:h-0.5 after:bg-gradient-to-r after:from-[#8B0000] after:to-[#DAA520] after:rounded-full">
                  محصولات کرابو
                </h2>
                <p className="text-gray-400 text-sm md:text-base mt-6">
                  انتخابی شیک و خاص با بهترین کیفیت
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {category.data.sub_categories &&
                category.data.sub_categories.length > 0 ? (
                  category.data.sub_categories.map((data, index) => (
                    <div
                      key={index}
                      className="animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <Product3 product={data} rtl={true} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 md:py-20 bg-white rounded-2xl border border-[#8B0000]/10 shadow-sm">
                    <div className="text-5xl mb-4 opacity-50">🔍</div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
                      هیچ محصولی یافت نشد
                    </h3>
                    <p className="text-sm text-gray-400">
                      محصولی در این دسته‌بندی موجود نیست
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <FooterMobile location="home" header={headerData} />
      </MainLayout>

      <style jsx global>{`
        @keyframes slowMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-slowMove {
          animation: slowMove 40s linear infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease backwards;
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </>
  );
};

export default Index;

export async function getServerSideProps(context) {
  let category = { success: false, data: null };
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
      `https://python.krabo.gold/api/product/${context.params.idCategory}/`,
      { timeout: 10000 },
    );

    if (data && data.category_detail) {
      category = {
        status: 200,
        success: true,
        data: data,
      };
    } else {
      console.error("Category data is incomplete:", data);
      category = {
        status: 404,
        success: false,
        data: null,
        message: "دسته بندی یافت نشد",
      };
    }
  } catch (error) {
    console.error("Category fetch error:", error.message);
    category = {
      status: 500,
      message: error.message,
      success: false,
      data: null,
    };
  }

  return {
    props: {
      category: category,
      header: header,
    },
  };
}
