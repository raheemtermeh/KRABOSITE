import Head from "next/head";
import axios from "axios";

//= Layout
import MainLayout from "@layouts/Main";
//= Components
import Shop from "@components/Product/Category";
import Footer from "@components/Footer/Footer";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import navbarScrollEffect from "@common/navbarScrollEffect";
import Navbar from "@components/Navbars/AppNav/kraboHeader";
import useFetchCartItems from "@components/Product/useFetchCartItems";
import LoadingBar from "@components/loadingBar";
import FooterMobile from "@components/Navbars/AppNav/FooterMobile";

const Index = ({ category, header }) => {
  const navbarRef = useRef(null);
  const router = useRouter();
  const totalItems = useFetchCartItems();
  const [page, setPage] = useState(1);
  const [product, setProduct] = useState([]);
  const [event_list, setevent_list] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category?.data?.product) {
      setProduct(category.data.product);
    }
  }, [category]);

  useMemo(() => {
    const fetchProducts = async () => {
      if (!category?.data?.category_detail?.main?.slug) return;

      setLoading(true);
      try {
        const { data } = await axios.get("/api/product/main-category", {
          params: {
            main: category.data.category_detail.main.slug,
            sub_categories: category.data.sub_categories?.[0]?.slug,
            price__gte: category.price__gte,
            price__lte: category.price__lte,
            weight__gte: category.weight__gte,
            weight__lte: category.weight__lte,
            event_list: event_list,
            page: page,
          },
        });
        setProduct((prev) => [...prev, ...(data?.product || [])]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (page > 2) {
      fetchProducts();
    }
  }, [page, category, event_list]);

  useEffect(() => {
    navbarScrollEffect(navbarRef.current, true);
    if (!category.success || header.status === 404) {
      router.push("/404");
      return;
    }
    if (document.querySelector("#cart-2") && totalItems) {
      document
        .querySelector("#cart-2")
        .setAttribute("data-totalitems", totalItems);
    }
  }, [navbarRef, totalItems, header.status, category.success, router]);

  // اگر هدر داده معتبر ندارد، از یک منوی پیش‌فرض استفاده کن
  const headerData = header?.data?.menu
    ? header.data
    : { menu: [], name: "home", idd: "home" };

  return (
    category.success && (
      <>
        <Head>
          <title>
            {category?.data?.category_detail?.title_seo || "گالری کرابو"}
          </title>
          <meta
            name="description"
            content={
              category?.data?.category_detail?.description_seo ||
              "خرید آنلاین طلا و جواهر"
            }
          />
          <meta
            property="og:title"
            content={category?.data?.category_detail?.title_seo}
          />
          <meta
            property="og:description"
            content={category?.data?.category_detail?.description_seo}
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
          <Navbar navbarRef={navbarRef} header={headerData} />

          <main className="shop-page style-5 style-grad">
            {/* متن تبلیغاتی کوچک و مدرن */}
            <div className="promo-banner">
              <div className="promo-content">
                <span className="promo-icon">✨</span>
                <p className="promo-text">
                  خرید آنلاین گوشواره میخی طلا زنانه از فروشگاه کرابو
                </p>
                <span className="promo-icon">✨</span>
              </div>
            </div>

            <Shop
              page={page}
              setPage={setPage}
              header={header}
              productAll={category}
              detail={category?.data?.category_detail}
              product={product}
              category={category?.data?.sub_categories}
              event_list={category?.data?.event_list}
              price__lte={category.price__lte}
              price__gte={category.price__gte}
              weight__lte={category.weight__lte}
              weight__gte={category.weight__gte}
              path={category.path}
              event_list_set={category.event_list}
              loading={loading}
              style="4"
              rtl
            />
            {loading && <LoadingBar />}
          </main>
          <Footer />
          <FooterMobile location="home" header={headerData} />
        </MainLayout>
      </>
    )
  );
};

export default Index;

export async function getServerSideProps(context) {
  let category = { success: false };
  let header = { success: false };

  try {
    const response = await axios.get(
      `https://da.linooxel.com/kraboheader.json`,
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        timeout: 10000,
      },
    );

    let headerData = response.data;

    if (headerData?.status === true && headerData?.data) {
      headerData = headerData.data;
    }

    header = {
      status: 200,
      success: true,
      data: headerData,
    };
    console.log("Header data structure:", JSON.stringify(headerData, null, 2));
  } catch (error) {
    console.error("Header fetch error:", error.message);
    header = {
      status: 200,
      success: true,
      data: {
        menu: [
          { title: "زنانه", url: "/category/women", menu_item: [] },
          { title: "مردانه", url: "/category/men", menu_item: [] },
          { title: "بچگانه", url: "/category/kids", menu_item: [] },
        ],
        name: "home",
        idd: "home",
      },
    };
  }

  let {
    price__lte = "",
    price__gte = "",
    weight__lte = "",
    weight__gte = "",
    size__lte = "",
    size__gte = "",
    event_list = "",
  } = context.query || {};

  try {
    let apiUrl = `https://python.krabo.gold/api/product/${context.params.idCategory}/${context.params.idSubCategory}/?page=1`;

    if (price__gte) apiUrl += `&properties__help_price__gte=${price__gte}`;
    if (price__lte) apiUrl += `&properties__help_price__lte=${price__lte}`;
    if (weight__gte) apiUrl += `&properties__weight__gte=${weight__gte}`;
    if (weight__lte) apiUrl += `&properties__weight__lte=${weight__lte}`;
    if (size__gte) apiUrl += `&properties__size__gte=${size__gte}`;
    if (size__lte) apiUrl += `&properties__size__lte=${size__lte}`;
    if (event_list) apiUrl += `&event_list__in=${event_list}`;

    console.log("API URL:", apiUrl);

    const { data } = await axios.get(apiUrl, { timeout: 15000 });

    category = {
      status: 200,
      path: `/product/${context.params.idCategory}/${context.params.idSubCategory}/`,
      price__lte: price__lte || data?.setting?.price?.max || "",
      price__gte: price__gte || data?.setting?.price?.min || "",
      weight__lte: weight__lte || data?.setting?.weight?.max || "",
      weight__gte: weight__gte || data?.setting?.weight?.min || "",
      size__lte: size__lte || data?.setting?.size?.max || "",
      size__gte: size__gte || data?.setting?.size?.min || "",
      event_list: event_list ? event_list.split(",") : [],
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Category fetch error:", error.message);
    category = {
      status: error.response?.status || 500,
      message: error.message,
      success: false,
    };
  }

  return {
    props: {
      category: category,
      header: header,
    },
  };
}
