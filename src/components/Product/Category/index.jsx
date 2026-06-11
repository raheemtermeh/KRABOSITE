import { useEffect, useState, useCallback, useRef } from "react";
import shopData from "@data/App/shop.json";
import shopDataRTL from "@data/App/shop-rtl.json";
import Categories from "./Categories";
import Filter from "./Filter";
import Product from "./Product2";
import TopFilter from "./TopFilter";
import Link from "next/link";
import useIsMobile from "hook/isMobile";
import GlobalNavbar from "@components/Navbars/AppNav/GlobalNavbar";
import navbarScrollEffect from "@common/navbarScrollEffect";

const Shop = ({
  style = "4",
  rtl,
  detail,
  category,
  event_list,
  header,
  productAll,
  product,
  price__lte,
  price__gte,
  weight__lte,
  weight__gte,
  size__lte,
  size__gte,
  path,
  setPage,
  page,
  loading,
}) => {
  const isMobile = useIsMobile();
  const [listView, setListView] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const data = rtl ? shopDataRTL : shopData;
  const [ProductFilter, setProductFilter] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const scrollTimeout = useRef(null);
  const isFirstRender = useRef(true);
  const navbarRef = useRef(null);

  // اسکرول افکت برای هدر
  useEffect(() => {
    navbarScrollEffect(navbarRef.current, true);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      setShowFilter(!isMobile);
      isFirstRender.current = false;
    }
  }, [isMobile]);

  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) return;

    scrollTimeout.current = setTimeout(() => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (
        scrollTop + windowHeight >= fullHeight - 100 &&
        !loading &&
        page < pageNumber
      ) {
        setPage((prev) => prev + 1);
      }
      scrollTimeout.current = null;
    }, 100);
  }, [loading, page, pageNumber, setPage]);

  useEffect(() => {
    setPageNumber(productAll?.data?.setting?.page || 1);

    const debouncedHandleScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [productAll?.data?.setting?.page, handleScroll]);

  const handleSetListView = useCallback((value) => setListView(value), []);
  const handleSetShowFilter = useCallback((value) => setShowFilter(value), []);
  const handleSetProductFilter = useCallback(
    (value) => setProductFilter(value),
    [],
  );

  const renderTitle = () => {
    const title = detail?.title_seo || "";
    if (title.indexOf("کرابو") === -1) {
      return title;
    }
    const parts = title.split("کرابو");
    return (
      <>
        {parts[0]}
        <span className="highlight-title"> کرابو </span>
        {parts[1]}
      </>
    );
  };

  // آماده‌سازی دیتای هدر
  const headerData = header?.data || null;

  // منوی پیش‌فرض معتبر با ساختار درست
  const defaultHeader = {
    menu: [
      { title: "صفحه نخست", url: "/", menu_item: [] },
      { title: "گردنبند", url: "/product/necklaces", menu_item: [] },
      { title: "گوشواره", url: "/product/earrings", menu_item: [] },
      { title: "دستبند", url: "/product/bracelets", menu_item: [] },
      { title: "انگشتر", url: "/product/womens-gold-ring", menu_item: [] },
      { title: "آویز", url: "/product/watch-pendant", menu_item: [] },
    ],
  };

  // اگر headerData وجود دارد و menu دارد از آن استفاده کن، وگرنه از defaultHeader استفاده کن
  const finalHeader =
    headerData && headerData.menu && headerData.menu.length > 0
      ? headerData
      : defaultHeader;

  return (
    <>
      {/* هدر */}
      {/* <GlobalNavbar
        navbarRef={navbarRef}
        headerData={finalHeader}
        location="shop-page"
        searchShow={true}
      /> */}

      <section className="shop section-padding pt-50">
        <div className="container">
          <style jsx>{`
            .section-head {
              position: relative;
              margin-bottom: 40px;
            }

            .section-head h2 {
              font-size: 2.5rem;
              font-weight: 700;
              color: #1a1a2e;
              position: relative;
              display: inline-block;
              padding: 0 20px;
              letter-spacing: -0.5px;
              animation: fadeInUp 0.8s ease-out;
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .section-head h2::after {
              content: "";
              position: absolute;
              bottom: -15px;
              left: 50%;
              transform: translateX(-50%);
              width: 80px;
              height: 3px;
              background: linear-gradient(90deg, #880a0a, #ff8c00, #880a0a);
              border-radius: 3px;
              animation: widthPulse 2s ease-in-out infinite;
            }

            @keyframes widthPulse {
              0%,
              100% {
                width: 80px;
                opacity: 0.6;
              }
              50% {
                width: 120px;
                opacity: 1;
              }
            }

            .section-head h2::before {
              content: "✦";
              position: absolute;
              bottom: -28px;
              left: 50%;
              transform: translateX(-50%);
              color: #880a0a;
              font-size: 12px;
              animation: rotateStar 3s linear infinite;
              z-index: 1;
            }

            @keyframes rotateStar {
              from {
                transform: translateX(-50%) rotate(0deg);
              }
              to {
                transform: translateX(-50%) rotate(360deg);
              }
            }

            .highlight-title {
              color: #880a0a;
              position: relative;
              display: inline-block;
              font-weight: 800;
              animation: textGlow 2s ease-in-out infinite;
            }

            @keyframes textGlow {
              0%,
              100% {
                text-shadow: 0 0 0px rgba(136, 10, 10, 0);
              }
              50% {
                text-shadow: 0 0 5px rgba(136, 10, 10, 0.3);
              }
            }

            .highlight-title::after {
              content: "";
              position: absolute;
              bottom: -5px;
              left: 0;
              width: 100%;
              height: 2px;
              background: linear-gradient(90deg, #880a0a, #ff8c00);
              animation: slideLine 1.5s ease-in-out infinite;
              transform-origin: left;
            }

            @keyframes slideLine {
              0% {
                transform: scaleX(0);
                transform-origin: right;
              }
              50% {
                transform: scaleX(1);
                transform-origin: right;
              }
              50.1% {
                transform-origin: left;
              }
              100% {
                transform: scaleX(0);
                transform-origin: left;
              }
            }

            /* ========== استایل جدید باکس بالایی کنار جملات ========== */
            .top-info-strip {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 25px;
              flex-wrap: wrap;
              margin-bottom: 20px;
              animation: fadeInUp 0.8s ease-out 0.1s backwards;
            }

            .info-chip {
              display: flex;
              align-items: center;
              gap: 10px;
              background: linear-gradient(135deg, #fff9f5, #fff);
              padding: 8px 18px;
              border-radius: 50px;
              border: 1px solid rgba(136, 10, 10, 0.12);
              transition: all 0.3s ease;
              cursor: default;
            }

            .info-chip:hover {
              transform: translateY(-3px);
              box-shadow: 0 8px 20px rgba(136, 10, 10, 0.1);
              border-color: rgba(136, 10, 10, 0.25);
            }

            .chip-icon {
              width: 30px;
              height: 30px;
              background: #880a0a10;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              animation: iconPop 2s ease-in-out infinite;
            }

            @keyframes iconPop {
              0%,
              100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
              }
            }

            .chip-text {
              font-size: 13px;
              color: #444;
            }

            .chip-text strong {
              color: #880a0a;
              font-weight: 700;
            }

            .gold-chip {
              background: linear-gradient(135deg, #fff8f0, #fff);
            }

            .gold-chip .chip-icon {
              background: linear-gradient(135deg, #ffd70020, #ffed4e20);
              animation: shimmer 2s ease-in-out infinite;
            }

            @keyframes shimmer {
              0% {
                opacity: 0.7;
              }
              50% {
                opacity: 1;
              }
              100% {
                opacity: 0.7;
              }
            }

            .separator-diamond {
              width: 4px;
              height: 4px;
              background: #880a0a;
              border-radius: 50%;
              animation: pulse 1.5s ease-in-out infinite;
            }

            @keyframes pulse {
              0%,
              100% {
                opacity: 0.4;
                transform: scale(1);
              }
              50% {
                opacity: 1;
                transform: scale(1.3);
              }
            }

            /* ========== استایل بریدکرامب ========== */
            .page-links {
              margin-top: 15px;
              font-size: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              flex-wrap: wrap;
              animation: fadeInUp 0.8s ease-out 0.2s backwards;
            }

            .page-links a {
              color: #666;
              text-decoration: none;
              transition: all 0.3s ease;
              position: relative;
              padding: 4px 8px;
              border-radius: 6px;
              display: inline-flex;
              align-items: center;
              gap: 4px;
            }

            .page-links a:first-child::before {
              content: "🏠";
              font-size: 12px;
              opacity: 0.7;
            }

            .page-links a:hover {
              color: #880a0a;
              transform: translateX(-4px);
            }

            .page-links a::after {
              content: "";
              position: absolute;
              top: 50%;
              left: 50%;
              width: 0;
              height: 0;
              border-radius: 50%;
              background: rgba(136, 10, 10, 0.1);
              transform: translate(-50%, -50%);
              transition:
                width 0.4s,
                height 0.4s;
            }

            .page-links a:hover::after {
              width: 100%;
              height: 100%;
            }

            .page-links .color-000 {
              color: #880a0a;
              font-weight: 600;
              position: relative;
            }

            .page-links .color-000::before {
              content: "";
              position: absolute;
              left: -12px;
              top: 50%;
              transform: translateY(-50%);
              width: 6px;
              height: 6px;
              background: #880a0a;
              border-radius: 50%;
              animation: blinkDot 1s ease-in-out infinite;
            }

            @keyframes blinkDot {
              0%,
              100% {
                opacity: 1;
                transform: translateY(-50%) scale(1);
              }
              50% {
                opacity: 0.3;
                transform: translateY(-50%) scale(0.8);
              }
            }

            .page-links span {
              color: #ccc;
              animation: bounceDot 1s ease-in-out infinite;
              display: inline-block;
            }

            @keyframes bounceDot {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-2px);
              }
            }

            .page-links .separator {
              margin: 0 4px;
              animation: none;
            }

            /* ========== استایل باکس پایین محصولات ========== */
            .bottom-features {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 30px;
              flex-wrap: wrap;
              margin-top: 60px;
              padding: 30px 20px;
              border-top: 1px solid rgba(136, 10, 10, 0.1);
              animation: fadeInUp 0.8s ease-out;
            }

            .feature-item {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 24px;
              background: #fff;
              border-radius: 50px;
              transition: all 0.3s ease;
              cursor: default;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
            }

            .feature-item:hover {
              transform: translateY(-5px);
              box-shadow: 0 12px 28px rgba(136, 10, 10, 0.12);
            }

            .feature-icon {
              width: 45px;
              height: 45px;
              background: linear-gradient(135deg, #880a0a10, #ff8c0010);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              transition: all 0.3s ease;
            }

            .feature-item:hover .feature-icon {
              transform: scale(1.1) rotate(5deg);
            }

            .feature-text h4 {
              font-size: 16px;
              font-weight: 700;
              color: #1a1a2e;
              margin-bottom: 4px;
            }

            .feature-text p {
              font-size: 12px;
              color: #888;
              margin: 0;
            }

            @media (max-width: 768px) {
              .section-head h2 {
                font-size: 1.8rem;
              }
              .section-head h2::after {
                width: 60px;
              }
              @keyframes widthPulse {
                0%,
                100% {
                  width: 60px;
                }
                50% {
                  width: 90px;
                }
              }
              .top-info-strip {
                gap: 12px;
              }
              .info-chip {
                padding: 5px 12px;
              }
              .chip-text {
                font-size: 11px;
              }
              .bottom-features {
                gap: 15px;
                margin-top: 40px;
                padding: 20px 15px;
              }
              .feature-item {
                padding: 8px 16px;
              }
              .feature-icon {
                width: 35px;
                height: 35px;
                font-size: 18px;
              }
              .feature-text h4 {
                font-size: 13px;
              }
              .feature-text p {
                font-size: 10px;
              }
            }

            @media (max-width: 480px) {
              .section-head h2 {
                font-size: 1.4rem;
              }
              .page-links {
                font-size: 11px;
              }
              .top-info-strip {
                gap: 8px;
              }
              .info-chip {
                padding: 4px 10px;
              }
              .chip-text {
                font-size: 9px;
              }
              .bottom-features {
                flex-direction: column;
                align-items: stretch;
              }
              .feature-item {
                justify-content: center;
              }
            }
          `}</style>

          <div
            className={`section-head text-center style-${style} ${style === "5" ? "mb-80" : ""}`}
          >
            {/* <h2 className="mb-20">{renderTitle()}</h2> */}

            <div className="page-links color-999">
              <Link href="/" className="me-2">
                صفحه نخست
              </Link>
              <span className="separator">›</span>
              <Link href={`/product/${detail?.main?.slug}`} className="me-2">
                {detail?.main?.name}
              </Link>
              <span className="separator">›</span>
              <a
                href={`/product/${detail?.main?.slug}/${detail?.slug}`}
                className="color-000"
              >
                {detail?.name}
              </a>
            </div>
          </div>

          <div className="row gx-4">
            <div className="col-lg-3 col-sm-6">
              <div className="filter">
                <Categories rtl={rtl} category={category} />
                {showFilter && (
                  <Filter
                    key={`filter-${path}`}
                    style={style}
                    rtl={rtl}
                    state={ProductFilter}
                    setState={handleSetProductFilter}
                    event_list={event_list}
                    header={header}
                    product={productAll}
                    price__lte={price__lte}
                    price__gte={price__gte}
                    weight__lte={weight__lte}
                    weight__gte={weight__gte}
                    size__lte={size__lte}
                    size__gte={size__gte}
                    path={path}
                  />
                )}
              </div>
            </div>

            <div className="col-lg-9">
              <div className="products-content">
                <TopFilter
                  setListView={handleSetListView}
                  setShowFilter={handleSetShowFilter}
                  showFilter={showFilter}
                  rtl={rtl}
                />

                <div className={`products ${listView ? "list-view" : ""}`}>
                  <div className="row gx-2 gx-lg-4">
                    {product?.length > 0 ? (
                      product.map((item, index) => (
                        <Product
                          key={item?.id || index}
                          product={item}
                          rtl={rtl}
                          header={header}
                        />
                      ))
                    ) : (
                      <div className="col-12 text-center py-5">
                        <p>هیچ محصولی یافت نشد</p>
                      </div>
                    )}
                  </div>

                  {loading && (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">
                          در حال بارگذاری...
                        </span>
                      </div>
                      <p>در حال بارگذاری محصولات بیشتر...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;
