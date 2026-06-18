import { useMemo, useState, useEffect, useRef } from "react";
import logoo from "../../../public/assets/img/logo.png";
import Image from "next/image";
import MainLayout from "@layouts/Main";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
import axios from "axios";
import jalaali from "jalaali-js";
import FooterMobile from "@components/Navbars/AppNav/FooterMobile";
import NumberFormat from "react-number-format";
import { round } from "lodash";

function Factor({ header }) {
  const router = useRouter();
  const id = router.query.idFactor;
  const factorRef = useRef(null);

  const [myFactor, setMyFactor] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function convertToShamsi(gregorianDate) {
    if (!gregorianDate) return "-";
    const datePart = gregorianDate?.split("T")[0];
    const [year, month, day] = datePart.split("-")?.map(Number);
    const shamsiDate = jalaali.toJalaali(year, month, day);
    return `${shamsiDate.jy}/${shamsiDate.jm}/${shamsiDate.jd}`;
  }

  async function fetchFactorData() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("userInfoKrabo")
        ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
        : null;

      if (!token) {
        throw new Error("No token found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        "https://python.krabo.gold/api/order/my-factor/",
        { id },
        { headers },
      );

      console.log(
        "FACTOR FULL RESPONSE:",
        JSON.stringify(response.data, null, 2),
      );

      if (response.status === 200) {
        setMyFactor(response);
      }
    } catch (error) {
      console.error("Failed to fetch factor:", error);
      setError("خطا در دریافت اطلاعات فاکتور");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchFactorData();
    }
  }, [id]);

  const generatePNG = async () => {
    const element = factorRef.current;
    if (!element) {
      alert("عنصر فاکتور یافت نشد");
      return;
    }

    setIsGenerating(true);

    try {
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const rect = element.getBoundingClientRect();

      console.log("Element dimensions:", rect.width, rect.height);

      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: false,
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff",
        width: rect.width,
        height: rect.height,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        windowWidth: rect.width,
        windowHeight: rect.height,
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            const computed = clonedDoc.defaultView.getComputedStyle(el);
            const props = [
              "color",
              "backgroundColor",
              "borderColor",
              "borderTopColor",
              "borderRightColor",
              "borderBottomColor",
              "borderLeftColor",
            ];
            props.forEach((prop) => {
              const value = computed[prop];
              if (
                value &&
                (value.includes("oklch") || value.includes("lab("))
              ) {
                if (prop.includes("border")) {
                  el.style[prop] = "rgb(51, 51, 51)";
                } else if (prop === "backgroundColor") {
                  el.style[prop] = "rgb(255, 255, 255)";
                } else {
                  el.style[prop] = "rgb(0, 0, 0)";
                }
              }
            });
          });
        },
      });

      console.log("Canvas created:", canvas.width, canvas.height);

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 1.0);
      });

      if (!blob) {
        throw new Error("Failed to create blob");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `factor-${id}-${Date.now()}.png`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("خطا در ایجاد تصویر: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <MainLayout isRTL>
        <div className="modern-loading-wrapper">
          <div className="modern-loading-card">
            <div className="modern-loading-spinner">
              <div className="modern-spinner-ring"></div>
              <div className="modern-spinner-ring"></div>
              <div className="modern-spinner-ring"></div>
              <div className="modern-spinner-core"></div>
            </div>
            <h3 className="modern-loading-title">در حال دریافت فاکتور</h3>
            <p className="modern-loading-text">لطفاً چند لحظه صبر کنید...</p>
            <div className="modern-loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !myFactor?.data) {
    return (
      <MainLayout isRTL>
        <div className="modern-error-wrapper">
          <div className="modern-error-card">
            <div className="modern-error-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="modern-error-title">خطا در دریافت اطلاعات</h3>
            <p className="modern-error-text">
              {error || "فاکتور مورد نظر یافت نشد"}
            </p>
            <button
              className="modern-error-btn"
              onClick={() => router.push("/profile")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              بازگشت به پروفایل
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const factorData = myFactor?.data?.data?.[0];
  const productsFromProduct = myFactor?.data?.product || [];
  const itemsFromData = factorData?.item || [];

  const tableItems =
    productsFromProduct.length > 0
      ? productsFromProduct.map((p, i) => ({
        id: i + 1,
        name: p.product__name || p.product?.name || "-",
        karat: p.product__karat || 18,
        weight: p.property__weight || p.property?.weight || "-",
        salary: p.property__salary || p.property?.salary || 0,
        help_price: p.property__help_price || p.property?.help_price || 0,
      }))
      : itemsFromData.map((item, i) => ({
        id: i + 1,
        name: item.product || item.product__name || "-",
        karat: item.karat || 18,
        weight: item.property?.[0]?.weight || item.weight || "-",
        salary: item.property?.[0]?.salary || item.salary || 0,
        help_price: item.property?.[0]?.help_price || item.help_price || 0,
      }));

  const sum = myFactor?.data?.sum;
  const goldPrice = factorData?.item?.[0]?.gold_price;
  const isPaid = factorData?.pay_status;

  return (
    <>
      <MainLayout isRTL>
        <style>{`
          /* ===== استایل‌های قالب فاکتور (بدون تغییر) ===== */
          @media print {
            .no-print { display: none !important; }
            .factor-page { box-shadow: none !important; margin: 0 !important; }
          }
          .factor-table th, .factor-table td {
            border: 1.5px solid #333 !important;
            padding: 14px 10px !important;
            font-size: 15px;
          }
          .factor-table th {
            background-color: #f8f8f8 !important;
            font-weight: bold !important;
            text-align: center !important;
          }
          .factor-table td {
            text-align: center !important;
            vertical-align: middle !important;
          }
          .info-box {
            border: 1.5px solid #333 !important;
            border-radius: 6px !important;
            padding: 10px 20px !important;
            font-size: 15px;
            font-weight: bold;
          }

          /* ===== پس‌زمینه کلی صفحه - با اسکرول افقی برای موبایل ===== */
          .factor-modern-wrapper {
            min-height: 100vh;
            background: linear-gradient(135deg, #FFFEF9 0%, #FFF9F0 50%, #FFFEF9 100%);
            background-size: 200% 200%;
            animation: gradientShift 15s ease infinite;
            padding: 30px 20px 60px;
            position: relative;
            overflow-x: auto;
            overflow-y: visible;
          }

          .factor-modern-wrapper::before {
            content: '';
            position: absolute;
            top: -30%;
            right: -15%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(201, 169, 97, 0.12) 0%, transparent 70%);
            border-radius: 50%;
            animation: float 20s ease-in-out infinite;
            pointer-events: none;
          }

          .factor-modern-wrapper::after {
            content: '';
            position: absolute;
            bottom: -20%;
            left: -10%;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(136, 10, 10, 0.08) 0%, transparent 70%);
            border-radius: 50%;
            animation: float 25s ease-in-out infinite reverse;
            pointer-events: none;
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          /* ===== کانتینر داخلی با عرض ثابت ===== */
          .factor-inner-container {
            max-width: 900px;
            min-width: 900px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
          }

          /* ===== کانتینر دکمه‌های عملیات ===== */
          .factor-actions-container {
            max-width: 900px;
            min-width: 900px;
            margin: 0 auto 30px;
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            animation: slideDown 0.6s ease;
          }

          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* ===== دکمه پرداخت - استایل اصلی (خفن) ===== */
          .btn-pay-modern {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            background: linear-gradient(135deg, #880A0A 0%, #A01010 50%, #880A0A 100%);
            background-size: 200% 200%;
            color: white;
            border: none;
            padding: 18px 56px;
            border-radius: 18px;
            font-size: 19px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 
              0 10px 30px rgba(136, 10, 10, 0.35),
              0 0 0 0 rgba(136, 10, 10, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            overflow: hidden;
            font-family: inherit;
            letter-spacing: 0.5px;
            animation: pulseGlow 2.5s ease-in-out infinite, bgShift 4s ease infinite;
          }

          @keyframes pulseGlow {
            0%, 100% {
              box-shadow: 
                0 10px 30px rgba(136, 10, 10, 0.35),
                0 0 0 0 rgba(136, 10, 10, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
            50% {
              box-shadow: 
                0 15px 40px rgba(136, 10, 10, 0.5),
                0 0 0 12px rgba(136, 10, 10, 0),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
          }

          @keyframes bgShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          .btn-pay-modern::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.3),
              transparent
            );
            transition: left 0.7s ease;
          }

          .btn-pay-modern:hover::before {
            left: 100%;
          }

          .btn-pay-modern:hover {
            transform: translateY(-4px) scale(1.03);
            box-shadow: 
              0 20px 50px rgba(136, 10, 10, 0.5),
              0 0 0 0 rgba(136, 10, 10, 0),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }

          .btn-pay-modern:active {
            transform: translateY(-1px) scale(0.99);
          }

          .btn-pay-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            font-size: 18px;
            backdrop-filter: blur(10px);
          }

          /* ===== گروه دکمه‌های دوم (دانلود و بازگشت) ===== */
          .factor-secondary-actions {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .btn-secondary-modern {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 13px 32px;
            border-radius: 14px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 2px solid transparent;
            font-family: inherit;
            position: relative;
            overflow: hidden;
          }

          .btn-download-modern {
            background: white;
            color: #880A0A;
            border-color: #880A0A;
            box-shadow: 0 4px 15px rgba(136, 10, 10, 0.1);
          }

          .btn-download-modern:hover:not(:disabled) {
            background: #880A0A;
            color: white;
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(136, 10, 10, 0.3);
          }

          .btn-download-modern:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .btn-back-modern {
            background: rgba(255, 255, 255, 0.7);
            color: #555;
            border-color: #E0E0E0;
            backdrop-filter: blur(10px);
          }

          .btn-back-modern:hover {
            background: white;
            color: #880A0A;
            border-color: #880A0A;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          }

          .btn-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
          }

          /* ===== صفحه لودینگ مدرن ===== */
          .modern-loading-wrapper {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px 20px;
            background: linear-gradient(135deg, #FFFEF9 0%, #FFF9F0 100%);
            position: relative;
            overflow: hidden;
          }

          .modern-loading-card {
            background: white;
            padding: 60px 50px;
            border-radius: 28px;
            box-shadow: 0 25px 70px rgba(136, 10, 10, 0.12);
            text-align: center;
            border: 2px solid #F5E6C8;
            position: relative;
            animation: bounceIn 0.6s ease;
            max-width: 420px;
            width: 100%;
          }

          .modern-loading-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #880A0A, #C9A961, #880A0A);
            background-size: 200% 100%;
            animation: shimmer 2s linear infinite;
            border-radius: 28px 28px 0 0;
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          .modern-loading-spinner {
            position: relative;
            width: 90px;
            height: 90px;
            margin: 0 auto 28px;
          }

          .modern-spinner-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-radius: 50%;
            animation: modernSpin 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          }

          .modern-spinner-ring:nth-child(1) {
            border-top-color: #880A0A;
            border-right-color: #880A0A;
          }

          .modern-spinner-ring:nth-child(2) {
            border-top-color: #C9A961;
            border-left-color: #C9A961;
            animation-delay: -0.4s;
            width: 75%;
            height: 75%;
            top: 12.5%;
            left: 12.5%;
          }

          .modern-spinner-ring:nth-child(3) {
            border-bottom-color: #F5E6C8;
            border-right-color: #F5E6C8;
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
            background: linear-gradient(135deg, #880A0A, #C9A961);
            border-radius: 50%;
            animation: pulseCore 1.5s ease-in-out infinite;
          }

          @keyframes modernSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulseCore {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.7; }
          }

          .modern-loading-title {
            color: #880A0A;
            font-size: 22px;
            font-weight: 800;
            margin: 0 0 8px 0;
            background: linear-gradient(135deg, #880A0A, #C9A961);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .modern-loading-text {
            color: #666;
            font-size: 14px;
            margin: 0 0 20px 0;
          }

          .modern-loading-dots {
            display: flex;
            gap: 10px;
            justify-content: center;
          }

          .modern-loading-dots span {
            width: 10px;
            height: 10px;
            background: linear-gradient(135deg, #C9A961, #880A0A);
            border-radius: 50%;
            animation: dotBounce 1.4s ease-in-out infinite;
          }

          .modern-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
          .modern-loading-dots span:nth-child(3) { animation-delay: 0.4s; }

          @keyframes dotBounce {
            0%, 60%, 100% { transform: scale(0.8); opacity: 0.5; }
            30% { transform: scale(1.3); opacity: 1; }
          }

          @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.05); }
            70% { transform: scale(0.95); }
            100% { transform: scale(1); }
          }

          /* ===== صفحه خطا مدرن ===== */
          .modern-error-wrapper {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px 20px;
            background: linear-gradient(135deg, #FFFEF9 0%, #FFF9F0 100%);
          }

          .modern-error-card {
            background: white;
            padding: 60px 50px;
            border-radius: 28px;
            box-shadow: 0 25px 70px rgba(136, 10, 10, 0.12);
            text-align: center;
            border: 2px solid #F5E6C8;
            max-width: 450px;
            width: 100%;
            animation: bounceIn 0.6s ease;
          }

          .modern-error-icon {
            width: 90px;
            height: 90px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #FFE5E5 0%, #FFF0F0 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #880A0A;
            animation: shakeError 0.6s ease;
            border: 3px solid rgba(136, 10, 10, 0.1);
          }

          @keyframes shakeError {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
          }

          .modern-error-title {
            color: #880A0A;
            font-size: 24px;
            font-weight: 800;
            margin: 0 0 12px 0;
          }

          .modern-error-text {
            color: #666;
            font-size: 15px;
            margin: 0 0 28px 0;
            line-height: 1.7;
          }

          .modern-error-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, #880A0A 0%, #A01010 100%);
            color: white;
            border: none;
            padding: 14px 32px;
            border-radius: 14px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(136, 10, 10, 0.3);
            font-family: inherit;
          }

          .modern-error-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(136, 10, 10, 0.45);
          }
        `}</style>

        <div className="factor-modern-wrapper">
          <div className="factor-inner-container">
            {/* دکمه‌های عملیات */}
            <div className="factor-actions-container no-print">
              {/* دکمه پرداخت اصلی */}
              <button
                className="btn-pay-modern"
                onClick={() => {
                  window.open(
                    `http://krabo.gold:3421/api/order/go-to-geteway/?id=${id}`,
                    '_blank'
                  );
                }}
              >
                <span className="btn-pay-icon">💳</span>
                <span>پرداخت آنلاین</span>
              </button>

              {/* دکمه‌های ثانویه */}
              <div className="factor-secondary-actions">
                <button
                  className="btn-secondary-modern btn-download-modern"
                  onClick={generatePNG}
                  disabled={isGenerating}
                >
                  <span className="btn-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </span>
                  <span>{isGenerating ? "در حال ایجاد..." : "دانلود فاکتور"}</span>
                </button>

                <button
                  className="btn-secondary-modern btn-back-modern"
                  onClick={() => router.push("/profile")}
                >
                  <span className="btn-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                  </span>
                  <span>بازگشت</span>
                </button>
              </div>
            </div>

            {/* صفحه فاکتور (بدون تغییر) */}
            <div
              className="container factor-page"
              style={{
                maxWidth: "900px",
                minWidth: "900px",
                backgroundColor: "white",
                boxShadow: "0 0 20px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "50px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                ref={factorRef}
                style={{
                  padding: "30px 40px",
                  direction: "rtl",
                  backgroundColor: "white",
                }}
              >
                {/* ردیف اول: تاریخ و شماره سند */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    className="info-box"
                    style={{ minWidth: "220px", textAlign: "right" }}
                  >
                    تاریخ: {convertToShamsi(factorData?.created_at)}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    className="info-box"
                    style={{ minWidth: "220px", textAlign: "right" }}
                  >
                    شماره سند: {factorData?.id || id}
                  </div>
                </div>

                {/* خریدار */}
                <div
                  className="info-box"
                  style={{ marginBottom: "25px", textAlign: "right" }}
                >
                  خریدار : &nbsp; {factorData?.name || "........................"}
                </div>

                {/* جدول اصلی */}
                <div
                  style={{
                    position: "relative",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src={logoo.src}
                    alt="logo"
                    crossOrigin="anonymous"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "250px",
                      height: "250px",
                      objectFit: "contain",
                      opacity: 0.2,
                      pointerEvents: "none",
                      zIndex: 0,
                    }}
                  />

                  <table
                    className="factor-table"
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "2px solid #333",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "8%" }}>ردیف</th>
                        <th style={{ width: "35%" }}>شرح</th>
                        <th style={{ width: "10%" }}>عیار</th>
                        <th style={{ width: "12%" }}>وزن</th>
                        <th style={{ width: "15%" }}>فی</th>
                        <th style={{ width: "20%" }}>مبلغ (ریال)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableItems.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td style={{ textAlign: "right !important" }}>
                            {item.name}
                          </td>
                          <td>{item.karat}</td>
                          <td>{item.weight}</td>
                          <td>
                            {Number(item.salary || 0).toLocaleString("en-US")}
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            {Number(item.help_price || 0).toLocaleString("en-US")}
                          </td>
                        </tr>
                      ))}

                      {Array.from({
                        length: Math.max(0, 8 - tableItems.length),
                      }).map((_, index) => (
                        <tr key={`empty-${index}`} style={{ height: "50px" }}>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* نرخ طلای خام */}
                <div
                  className="info-box"
                  style={{ marginBottom: "30px", textAlign: "right" }}
                >
                  نرخ طلای خام : &nbsp;{" "}
                  {goldPrice
                    ? Number(goldPrice).toLocaleString("en-US")
                    : "........................"}
                </div>

                {/* متن تشکر و آدرس */}
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    lineHeight: "2.2",
                    margin: "30px 0",
                  }}
                >
                  <p style={{ margin: "5px 0" }}>
                    ضمن تشکر از انتخاب شما ، فرصت مرجوع کالا ها تا سه روز می باشد.
                  </p>
                  <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                    آدرس : بازار بزرگ تهران ، پاساژ رضا ، طبقه منفی یک، پلاک ۲۲۹
                  </p>
                </div>

                {/* فوتر: اینستاگرام - امضا - واتساپ */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "40px",
                    paddingTop: "15px",
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        background:
                          "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "18px",
                      }}
                    >
                      📷
                    </div>
                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                      krabo.gold
                    </span>
                  </div>

                  <div
                    style={{ fontSize: "14px", color: "#333", fontWeight: "bold" }}
                  >
                    امضاء فروشنده
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#25D366",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "18px",
                      }}
                    >
                      📱
                    </div>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        direction: "ltr",
                      }}
                    >
                      ۹۰۳۱۷۷۷۸۹
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>

      {header?.data && (
        <FooterMobile location="home" header={header.data.data} />
      )}
    </>
  );
}

export default Factor;

export async function getServerSideProps(context) {
  let header = {};
  try {
    const { data } = await axios.get(
      `https://da.linooxel.com/kraboheader.json`,
    );
    header = { status: 200, success: true, data: data };
  } catch (error) {
    header = { status: 500, message: error.message, success: false };
  }
  return { props: { header } };
}