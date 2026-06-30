import { useState, useEffect, useRef } from "react";
import MainLayout from "@layouts/Main";
import { useRouter } from "next/router";
import axios from "axios";
import jalaali from "jalaali-js";
import FooterMobile from "@components/Navbars/AppNav/FooterMobile";
import FactorInvoice from "@components/FactorInvoice/FactorInvoice";

function Factor({ header }) {
  const router = useRouter();
  const id = router.query.idFactor;
  const factorRef = useRef(null);

  const [myFactor, setMyFactor] = useState("");
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

  const handlePrintFactor = () => {
    if (!factorRef.current) {
      alert("عنصر فاکتور یافت نشد");
      return;
    }
    window.print();
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
  const statusCode = factorData?.status_code;

  // تابع کمکی برای دریافت وضعیت پرداخت
  const getPaymentStatus = (code) => {
    switch (code) {
      case 0:
        return {
          text: "لغو شده",
          color: "#dc3545",
          bg: "#dc354515",
          icon: "❌",
        };
      case 1:
        return {
          text: "پرداخت شده",
          color: "#28a745",
          bg: "#28a74515",
          icon: "✅",
        };
      case 2:
        return {
          text: "در انتظار پرداخت",
          color: "#ffc107",
          bg: "#ffc10715",
          icon: "⏳",
        };
      case 3:
        return {
          text: "ارسال شده",
          color: "#17a2b8",
          bg: "#17a2b815",
          icon: "📦",
        };
      case 4:
        return {
          text: "پیش فاکتور",
          color: "#6c757d",
          bg: "#6c757d15",
          icon: "📄",
        };
      default:
        return {
          text: "نامعلوم",
          color: "#6c757d",
          bg: "#6c757d15",
          icon: "❓",
        };
    }
  };

  const paymentStatus = getPaymentStatus(statusCode);
  const canPay = statusCode === 2 || statusCode === 4;

  const factorItems = tableItems.map((item) => ({
    id: item.id,
    name: item.name,
    karat: item.karat,
    weight: item.weight,
    fee: Number(item.salary || 0).toLocaleString("en-US"),
    amount: Number(item.help_price || 0).toLocaleString("en-US"),
  }));

  return (
    <>
      <MainLayout isRTL>
        <style>{`
          /* ===== نشانگر وضعیت پرداخت ===== */
          .payment-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
          }

          .payment-status-badge:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
          }

          .payment-status-icon {
            font-size: 20px;
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

          /* ===== کانتینر داخلی ===== */
          .factor-inner-container {
            max-width: 100%;
            margin: 0 auto 50px;
            position: relative;
            z-index: 2;
          }

          /* ===== کانتینر دکمه‌های عملیات ===== */
          .factor-actions-container {
            max-width: 148mm;
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
              {/* دکمه پرداخت اصلی - فقط در صورتی که قابل پرداخت باشد */}
              {canPay && (
                <button
                  className="btn-pay-modern"
                  onClick={() => {
                    window.open(
                      `http://krabo.gold:3421/api/order/go-to-geteway/?id=${id}`,
                      "_blank",
                    );
                  }}
                >
                  <span className="btn-pay-icon">💳</span>
                  <span>پرداخت آنلاین</span>
                </button>
              )}

              {/* دکمه‌های ثانویه */}
              <div className="factor-secondary-actions">
                <button
                  className="btn-secondary-modern btn-download-modern"
                  onClick={handlePrintFactor}
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
                      <polyline points="6 9 6 2 18 2 18 9"></polyline>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                      <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                  </span>
                  <span>چاپ / ذخیره PDF</span>
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

            <FactorInvoice
              ref={factorRef}
              date={convertToShamsi(factorData?.created_at)}
              documentNumber={factorData?.id || id}
              buyer={factorData?.name || "........................"}
              items={factorItems}
              goldRate={
                goldPrice
                  ? Number(goldPrice).toLocaleString("en-US")
                  : "........................"
              }
              minRows={8}
              showTerms={false}
              whatsappNumber="۹۰۳۱۷۷۷۸۹"
              instagramHandle="krabo.gold"
            >
              <div style={{ textAlign: "center", margin: "18px 0" }}>
                <div
                  className="payment-status-badge"
                  style={{
                    backgroundColor: paymentStatus.bg,
                    color: paymentStatus.color,
                    border: `2px solid ${paymentStatus.color}`,
                  }}
                >
                  <span className="payment-status-icon">
                    {paymentStatus.icon}
                  </span>
                  <span>وضعیت: {paymentStatus.text}</span>
                </div>
              </div>

              <div className="factor-terms">
                <p>
                  ضمن تشکر از انتخاب شما ، فرصت مرجوع کالا ها تا سه روز می
                  باشد.
                </p>
                <p>
                  آدرس : بازار بزرگ تهران ، پاساژ رضا ، طبقه منفی یک، پلاک ۲۲۹
                </p>
              </div>
            </FactorInvoice>
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
