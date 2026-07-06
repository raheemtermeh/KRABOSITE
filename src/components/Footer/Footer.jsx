import Link from "next/link";
import { useEffect } from "react";
import enamadimg from "../../../public/Linkssets/img/enamad.png";
import samandehi from "../../../public/Linkssets/img/samandehi-badge.png";
import paymentimg from "../../../public/Linkssets/img/payment-badge.png";
import Link from "next/link";
const Footer = ({ noWave, rtl }) => {
  const handleMouseMove = (event) => {
    const dropDownToggler = event.target.classList.contains("dropdown-toggle")
      ? event.target
      : event.target.querySelector(".dropdown-toggle");
    const dropDownMenu = dropDownToggler?.nextElementSibling;

    dropDownToggler?.classList?.add("show");
    dropDownMenu?.classList?.add("show");
  };

  const handleMouseLeave = (event) => {
    const dropdown = event.target.classList.contains("dropdown")
      ? event.target
      : event.target.closest(".dropdown");
    const dropDownToggler = dropdown.querySelector(".dropdown-toggle");
    const dropDownMenu = dropdown.querySelector(".dropdown-menu");

    dropDownToggler?.classList?.remove("show");
    dropDownMenu?.classList?.remove("show");
  };

  // کامپوننت باکس ویژگی‌ها
  const FeaturesBox = () => (
    <div className="features-box-wrapper">
      <style jsx>{`
        .features-box-wrapper {
          background: linear-gradient(135deg, #fff9f5 0%, #fff5ee 100%);
          border-radius: 1px;
          padding: 40px 30px;
          margin-bottom: 50px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.021);
        }

        .features-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .feature-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 25px;
          background: white;
          border-radius: 60px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: default;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(136, 10, 10, 0.08);
          min-width: 200px;
        }

        .feature-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 35px rgba(136, 10, 10, 0.15);
          border-color: rgba(136, 10, 10, 0.25);
        }

        .feature-icon {
          width: 55px;
          height: 55px;
          background: linear-gradient(135deg, #880a0a08, #ff8c0008);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
          background: linear-gradient(135deg, #880a0a15, #ff8c0015);
        }

        .feature-text h4 {
          font-size: 17px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 5px;
        }

        .feature-text p {
          font-size: 12px;
          color: #888;
          margin: 0;
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-card {
          animation: fadeSlideUp 0.6s ease-out backwards;
        }

        .feature-card:nth-child(1) {
          animation-delay: 0.1s;
        }
        .feature-card:nth-child(2) {
          animation-delay: 0.2s;
        }
        .feature-card:nth-child(3) {
          animation-delay: 0.3s;
        }
        .feature-card:nth-child(4) {
          animation-delay: 0.4s;
        }

        @media (max-width: 992px) {
          .features-box-wrapper {
            padding: 30px 20px;
          }
          .features-grid {
            gap: 20px;
          }
          .feature-card {
            padding: 12px 20px;
            min-width: 170px;
          }
          .feature-icon {
            width: 45px;
            height: 45px;
            font-size: 24px;
          }
          .feature-text h4 {
            font-size: 15px;
          }
        }

        @media (max-width: 768px) {
          .features-box-wrapper {
            padding: 25px 15px;
            margin-bottom: 30px;
          }
          .features-grid {
            gap: 15px;
          }
          .feature-card {
            padding: 10px 16px;
            min-width: auto;
            flex: 1;
            min-width: 160px;
          }
          .feature-icon {
            width: 38px;
            height: 38px;
            font-size: 20px;
          }
          .feature-text h4 {
            font-size: 13px;
          }
          .feature-text p {
            font-size: 10px;
          }
        }

        @media (max-width: 576px) {
          .features-grid {
            flex-direction: column;
            align-items: stretch;
          }
          .feature-card {
            justify-content: center;
          }
        }
      `}</style>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <div className="feature-text">
            <h4>خرید امن</h4>
            <p>گواهی‌نامه تضمین اصالت</p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <div className="feature-text">
            <h4>بسته‌بندی لوکس</h4>
            <p>هدیه مناسب برای عزیزان</p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔄</div>
          <div className="feature-text">
            <h4>تعویض ۷ روزه</h4>
            <p>بدون دلیل و شرایط خاص</p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💎</div>
          <div className="feature-text">
            <h4>تضمین کیفیت</h4>
            <p>با مهر کرابو</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* باکس ویژگی‌ها - اضافه شده بالای فوتر */}
      <FeaturesBox />

      {/* استایل‌های ریسپانسیو فوتر */}
      <style jsx>{`
        /* ریسپانسیو برای تبلت */
        @media (max-width: 992px) {
          .footer-title {
            font-size: 38px !important;
          }
          .footer-section-title {
            font-size: 28px !important;
          }
          .footer-link {
            font-size: 20px !important;
          }
          .footer-social-icon {
            width: 45px !important;
            height: 45px !important;
          }
          .footer-social-icon svg {
            width: 45px !important;
            height: 45px !important;
          }
          .footer-badge {
            height: 100px !important;
          }
        }

        /* ریسپانسیو برای موبایل */
        @media (max-width: 768px) {
          .footer-container {
            padding-top: 40px !important;
            padding-bottom: 30px !important;
          }
          .footer-main-wrapper {
            gap: 30px !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .footer-title {
            font-size: 32px !important;
            margin-right: 0 !important;
            margin-bottom: 25px !important;
            text-align: center !important;
          }
          .footer-social-wrapper {
            margin-right: 0 !important;
            justify-content: center !important;
            gap: 8px !important;
          }
          .footer-social-icon {
            width: 42px !important;
            height: 42px !important;
          }
          .footer-social-icon svg {
            width: 42px !important;
            height: 42px !important;
          }
          .footer-badges-wrapper {
            margin-top: 20px !important;
            justify-content: center !important;
            gap: 8px !important;
          }
          .footer-badge {
            height: 80px !important;
          }
          .footer-section-title {
            font-size: 24px !important;
            margin-bottom: 20px !important;
            text-align: center !important;
          }
          .footer-section {
            text-align: center !important;
            min-width: auto !important;
            width: 100% !important;
          }
          .footer-link {
            font-size: 18px !important;
            margin-bottom: 12px !important;
            text-align: center !important;
            display: block !important;
          }
          .footer-link:hover {
            transform: none !important;
          }
        }

        /* ریسپانسیو برای موبایل کوچک */
        @media (max-width: 576px) {
          .footer-container {
            padding-top: 30px !important;
            padding-bottom: 25px !important;
          }
          .footer-title {
            font-size: 28px !important;
            letter-spacing: 8px !important;
          }
          .footer-social-wrapper {
            gap: 6px !important;
          }
          .footer-social-icon {
            width: 38px !important;
            height: 38px !important;
          }
          .footer-social-icon svg {
            width: 38px !important;
            height: 38px !important;
          }
          .footer-badges-wrapper {
            gap: 6px !important;
          }
          .footer-badge {
            height: 70px !important;
          }
          .footer-section-title {
            font-size: 22px !important;
          }
          .footer-link {
            font-size: 16px !important;
            margin-bottom: 10px !important;
          }
        }

        /* ریسپانسیو برای موبایل خیلی کوچک */
        @media (max-width: 400px) {
          .footer-title {
            font-size: 24px !important;
            letter-spacing: 6px !important;
          }
          .footer-social-icon {
            width: 35px !important;
            height: 35px !important;
          }
          .footer-social-icon svg {
            width: 35px !important;
            height: 35px !important;
          }
          .footer-badge {
            height: 60px !important;
          }
          .footer-section-title {
            font-size: 20px !important;
          }
          .footer-link {
            font-size: 15px !important;
          }
        }
      `}</style>

      <footer
        className={`style-4 ${noWave ? "mt-0 pt-100" : ""}`}
        data-scroll-index="8"
        style={{ marginTop: "-1px" }}
      >
        <div className="bg-[#b3b795] footer-container pt-[60px] pb-[40px]">
          <div className="container">
            <div className="flex justify-center items-start mb-[50px] gap-[120px] max-w-[1200px] ml-auto mr-auto flex-row-reverse max-lg:flex-wrap max-lg:gap-[40px] max-md:flex-col max-md:items-center footer-main-wrapper">
              {/* برند و آیکون‌های اجتماعی - سمت چپ */}
              <div className="flex-[0_0_auto] footer-section">
                <h2 className="text-[48px] mr-40 font-light tracking-[12px] text-white mb-[40px] font-[Arial,sans-serif] max-lg:text-[38px] footer-title">
                  KRABO
                </h2>
                <div className="flex mr-36 gap-10 footer-social-wrapper">
                  <div className="w-[55px] h-[55px] rounded-full bg-transparent flex items-center justify-center transition-all duration-300 cursor-pointer border-white/30 hover:border-white/60 hover:-translate-y-[3px] footer-social-icon">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-[55px] h-[55px] fill-white"
                    >
                      <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                    </svg>
                  </div>
                  <div className="w-[55px] h-[55px] rounded-full bg-transparent flex items-center justify-center transition-all duration-300 cursor-pointer border-white/30 hover:border-white/60 hover:-translate-y-[3px] footer-social-icon">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-[55px] h-[55px] fill-white"
                    >
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z" />
                    </svg>
                  </div>
                  <div className="w-[55px] h-[55px] rounded-full bg-transparent flex items-center justify-center transition-all duration-300 cursor-pointer border-white/30 hover:border-white/60 hover:-translate-y-[3px] footer-social-icon">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-[55px] h-[55px] fill-white"
                    >
                      <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                    </svg>
                  </div>
                </div>

                {/* بخش بج‌ها زیر آیکون‌ها */}
                <div className="flex gap-[10px] items-center mt-[30px] max-md:justify-center footer-badges-wrapper">
                  <div className="text-center">
                    <img
                      src={enamadimg.src}
                      alt="enamad"
                      className="h-[120px] w-auto footer-badge"
                    />
                  </div>
                  <div className="text-center">
                    <img
                      src={samandehi.src}
                      alt="samandehi"
                      className="h-[120px] w-auto footer-badge"
                    />
                  </div>
                  <div className="text-center">
                    <img
                      src={paymentimg.src}
                      alt="payment"
                      className="h-[120px] w-auto footer-badge"
                    />
                  </div>
                </div>
              </div>

              {/* ستون حساب کاربری - وسط */}
              <div className="flex-[0_0_auto] min-w-[80px] max-md:text-center footer-section">
                <h3 className="text-[36px] font-semibold text-white mb-[25px] text-right max-md:text-center footer-section-title">
                  حساب کاربری
                </h3>
                <ul className="list-none p-0 m-0">
                  <li className="mb-[15px] text-right max-md:text-center">
                    <Link
                      href="#"
                      className="text-white/95 no-underline text-[24px] transition-all duration-300 inline-block hover:text-white hover:-translate-x-[5px] footer-link"
                    >
                      اطلاعات شخصی من
                    </Link>
                  </li>
                  <li className="mb-[15px] text-right max-md:text-center">
                    <Link
                      href="#"
                      className="text-white/95 no-underline text-[24px] transition-all duration-300 inline-block hover:text-white hover:-translate-x-[5px] footer-link"
                    >
                      سفارشات من
                    </Link>
                  </li>
                </ul>
              </div>

              {/* ستون پشتیبانی - سمت راست */}
              <div className="flex-[0_0_auto] min-w-[80px] max-md:text-center footer-section">
                <h3 className="text-[36px] font-semibold text-white mb-[25px] text-right max-md:text-center footer-section-title">
                  پشتیبانی
                </h3>
                <ul className="list-none p-0 m-0">
                  <li className="mb-[15px] text-right max-md:text-center">
                    <Link
                      href="/contactUs"
                      className="text-white/95 no-underline text-[24px] transition-all duration-300 inline-block hover:text-white hover:-translate-x-[5px] footer-link"
                    >
                      تماس با ما
                    </Link>
                  </li>
                  <li className="mb-[15px] text-right max-md:text-center">
                    <Link
                      href="/LinkboutUs"
                      className="text-white/95 no-underline text-[24px] transition-all duration-300 inline-block hover:text-white hover:-translate-x-[5px] footer-link"
                    >
                      آشنایی با کرابو{" "}
                    </Link>
                  </li>
                  <li className="mb-[15px] text-right max-md:text-center">
                    <Link
                      href="#"
                      className="text-white/95 no-underline text-[24px] transition-all duration-300 inline-block hover:text-white hover:-translate-x-[5px] footer-link"
                    >
                      رهگیری مرسولات پستی
                    </Link>
                  </li>
                  <li className="mb-[15px] text-right max-md:text-center">
                    <Link
                      href="/rules"
                      className="text-white/95 no-underline text-[24px] transition-all duration-300 inline-block hover:text-white hover:-translate-x-[5px] footer-link"
                    >
                      قوانین و مقررات
                    </Link>
                  </li>
                  <li className="mb-[15px] text-right max-md:text-center">
                    <Link
                      href="/questions"
                      className="text-white/95 no-underline text-[24px] transition-all duration-300 inline-block hover:text-white hover:-translate-x-[5px] footer-link"
                    >
                      سوالات متداول
                    </Link>
                  </li>
                  <li className="mb-[15px] text-right max-md:text-center">
                    <Link
                      href="#"
                      className="text-white/95 no-underline text-[24px] transition-all duration-300 inline-block hover:text-white hover:-translate-x-[5px] footer-link"
                    >
                      ثبت شکایات
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;