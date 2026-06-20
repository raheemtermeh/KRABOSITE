import { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
//= Layout
import MainLayout from "@layouts/Main";

const Page404 = () => {
  const navbarRef = useRef(null);

  useEffect(() => {
    // رفع خطای سینتکس در صورتی که خواستید بعداً فعالش کنید
    // navbarScrollEffect(navbarRef.current, true);
  }, [navbarRef]);

  return (
    <>
      <Head>
        <title>کرابو - صفحه‌ای پیدا نشد! | 404</title>
      </Head>

      <MainLayout>
        <main
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-amber-50/40 py-12 px-4 sm:px-6 lg:px-8"
          style={{ direction: "rtl" }}
        >
          <div className="max-w-md w-full text-center space-y-8 backdrop-blur-md bg-white/60 p-8 rounded-3xl shadow-xl border border-white/80 relative overflow-hidden">
            {/* دیزاین پس‌زمینه فانتزی */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-200 rounded-full blur-2xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-200 rounded-full blur-2xl opacity-50"></div>

            <div className="relative z-10">
              {/* عدد 404 با انیمیشن و رنگ‌بندی برند کرابو */}
              <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#880a0a] to-amber-700 animate-pulse tracking-widest">
                404
              </h1>

              {/* پیغام خطا */}
              <h2 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
                مسیر رو گم کردی کرابویی عزیز؟
              </h2>

              <p className="mt-4 text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                صفحه‌ای که به دنبال آن بودید یافت نشد یا ممکن است منتقل شده
                باشد. نگران نباشید، می‌توانید از دکمه زیر به خانه برگردید.
              </p>

              {/* دکمه‌های هدایت‌گر */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/">
                  <a className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#880a0a] hover:bg-[#6b0808] transition-all duration-300 shadow-lg shadow-red-900/20 transform hover:-translate-y-0.5">
                    <i className="bi bi-house-door ml-2 text-xl"></i>
                    بازگشت به صفحه اصلی
                  </a>
                </Link>

                <Link href="/contactUs">
                  <a className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm">
                    ارتباط با پشتیبانی
                  </a>
                </Link>
              </div>
            </div>

            {/* فوتر کوچک داخل کارت */}
            <div className="pt-6 border-top border-gray-200/60 text-xs text-gray-400">
              © ۲۰۲۶ کرابو. تمامی حقوق محفوظ است.
            </div>
          </div>
        </main>
      </MainLayout>
    </>
  );
};

export default Page404;
