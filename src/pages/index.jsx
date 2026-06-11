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

const HomeAppLanding = ({ home }) => {
  const navbarRef = useRef(null);
  const totalItems = useFetchCartItems();

  useEffect(() => {
    if (document.querySelector("#cart-2")) {
      if (totalItems) {
        document
          .querySelector("#cart-2")
          .setAttribute("data-totalitems", totalItems);
      }
    }
    navbarScrollEffect(navbarRef.current);
  }, [navbarRef, totalItems]);

  return (
    <>
      <Head>
        <title>گالری کرابو</title>
        <meta name="description" content="تستتتت" />
        <meta property="og:title" content="گالری کرابو" />
        <meta
          property="og:description"
          content="خرید طلا از فروشگاه اینترنتی گالری طلا کرابو.   خرید مجموعه متناسب با هر بودجه ای.  فروش نقدی و اقساط انواع طلا "
        />
        <meta property="og:type" content="website" />
        <meta charset="utf-8" />
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="googlebot" content="index,follow" />
        <meta property="og:site_name" content="گالری کرابو" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:url" content="https://krabo.gold" />
      </Head>
      <MainLayout isRTL>
        {home.success === true && (
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

              {/* <GoldRangBox/> */}

              {/* <CollectionList /> */}
              <Projects
                banner={home.data.data.box.filter((item) => {
                  return item.idd === "2019";
                })}
                boxNumber={3}
              />

              {/* <Projects banner={home.data.data.box.filter((item)=>{return item.idd==="2020"})} boxNumber={3}/> */}

              {/* <FeatureList /> */}
              {/* <Projects banner={home.data.data.box.filter((item)=>{return item.idd==="2018"})} boxNumber={4}/> */}

              {/* <Product style="4" suggested={home.data.data.box.filter((item)=>{return item.idd==="2021"})[0]} /> */}
            </main>
            <FooterMobile location={"home"} header={home.data.data.header} />
          </>
        )}

        <Footer rtl />
      </MainLayout>
    </>
  );
};

export default HomeAppLanding;

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

// export async function getServerSideProps() {
//   try {
//     const response = await fetch('https://python.krabo.gold/ui/slider');
//     const result = await response.json();

//     return {
//       props: {
//         test: result,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         test: [],
//         error: true,
//       },
//     };
//   }
// }
