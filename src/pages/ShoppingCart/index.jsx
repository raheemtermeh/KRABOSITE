import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "@layouts/Main";
import FooterMobile from "@components/Navbars/AppNav/FooterMobile";
import Navbar from "@components/Navbars/AppNav/kraboHeader";
import { useRouter } from "next/router";
import useFetchCartItems from "@components/Product/useFetchCartItems";
import Factor from "pages/factor/[idFactor]";
import NumberFormat from "react-number-format";
import { round } from "lodash";

const ShoppingCart = ({ header }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState({ name: "", address: "" });
  const [sum, setSum] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [id, setId] = useState("");
  const [factorId, setFactorId] = useState("");
  ///////////////////////////////////////////////

  const router = useRouter();

  async function fetchData() {
    try {
      const token = localStorage.getItem("userInfoKrabo")
        ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
        : null;

      if (!token) {
        throw new Error("No token found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(
        "https://python.krabo.gold/api/order/my-card/",
        { headers },
      );
      const _sum = response?.data?.sum;

      const products = response?.data;
      setCartItems(products);
      setSum(_sum);
      setLoading(false);
      const number = response?.data?.data?.length;
      localStorage.setItem("cartNumber", number);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        localStorage.removeItem("userInfoKrabo");
        console.error("Token expired or invalid. Removing token.");
      }
      console.error("Failed to fetch data:", error);
      setError("اطلاعات شما یافت نشد");
      setError(true);
      setLoading(false);
    }
  }

  const totalItems = useFetchCartItems();

  useEffect(() => {
    fetchData();
    setIsLogin(localStorage.getItem("userInfoKrabo"));
    if (document.querySelector("#cart-2")) {
      if (totalItems) {
        document
          .querySelector("#cart-2")
          .setAttribute("data-totalitems", totalItems);
      }
    }
  }, [totalItems]);

  if (loading) {
    return (
      <MainLayout isRTL>
        <Navbar />
        <div className="loading-container">
          <div className="loading-card">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">در حال بارگیری سبد خرید...</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    if (isLogin) {
      return (
        <MainLayout isRTL>
          <Navbar />
          <div className="loading-container">
            <div className="error-card">
              <div className="error-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3>خطا در بارگذاری</h3>
              <p>این صفحه اکنون در دسترس نمی باشد.</p>
              <button className="btn-primary" onClick={() => router.reload()}>
                تلاش مجدد
              </button>
            </div>
          </div>
        </MainLayout>
      );
    } else {
      router.push("/login");
    }
  }

  const handleQuantityChange = (id, quantity) => {
    const parsedQuantity = Math.max(1, Number(quantity));

    setCount((prevCount) => (prevCount === id ? parsedQuantity : prevCount));
  };

  const handleRemoveItem = async (id) => {
    const token = localStorage.getItem("userInfoKrabo")
      ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
      : null;

    if (token) {
      try {
        const response = await axios.delete(
          `https://python.krabo.gold/api/order/remove-to-card/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 200) {
          fetchData();
        } else {
          setError(true);
        }
      } catch (error) {
        console.log("Error removing item:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    } else {
      setError(true);
    }
  };

  const calculateTotal = () => {
    return cartItems?.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep = () => {
    let header = {};

    const headerPath = "D:/Aida/projects/krabo-frontend/header.json";

    try {
      const data = fs.readFileSync(headerPath, "utf-8");
      header = {
        status: 200,
        success: true,
        data: JSON.parse(data),
      };
    } catch (error) {
      header = {
        status: 500,
        message: "not found",
        success: false,
      };
    }

    switch (step) {
      case 1:
        return (
          <>
            <CartReview
              cartItems={cartItems}
              sum={sum}
              nextStep={nextStep}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
            />
          </>
        );
      case 2:
        return (
          <>
            <UserInfoForm
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              nextStep={nextStep}
              prevStep={prevStep}
              setId={setId}
              factorId={factorId}        // ✅ اضافه کن
              setFactorId={setFactorId}
            />
          </>
        );
      case 3:
        return (
          <>
            <Factor
              sum={sum}
              cartItems={cartItems}
              userInfo={userInfo}
              paymentMethod={paymentMethod}
              prevStep={prevStep}
              id={id}
            />
          </>
        );
      case 4:

      default:
        return (
          <>
            <CartReview cartItems={cartItems} nextStep={nextStep} />
          </>
        );
    }
  };

  return (
    <MainLayout isRTL>
      <Navbar />
      <style>{`
        * {
          box-sizing: border-box;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes loadingDots {
          0%, 20% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }

        .loading-container {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #FFFEF9 0%, #FFF9F0 100%);
        }

        .loading-card {
          background: white;
          padding: 60px 40px;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(136, 10, 10, 0.1);
          text-align: center;
          animation: fadeInScale 0.5s ease;
          border: 2px solid #F5E6C8;
        }

        .loading-spinner {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top-color: #880A0A;
          border-radius: 50%;
          animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }

        .spinner-ring:nth-child(2) {
          border-top-color: #C9A961;
          animation-delay: -0.5s;
        }

        .spinner-ring:nth-child(3) {
          border-top-color: #F5E6C8;
          animation-delay: -1s;
        }

        .loading-text {
          color: #880A0A;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .loading-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .loading-dots span {
          width: 10px;
          height: 10px;
          background: #C9A961;
          border-radius: 50%;
          animation: loadingDots 1.4s infinite;
        }

        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .error-card {
          background: white;
          padding: 60px 40px;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(136, 10, 10, 0.1);
          text-align: center;
          animation: fadeInScale 0.5s ease;
          border: 2px solid #F5E6C8;
          max-width: 400px;
        }

        .error-icon {
          color: #880A0A;
          margin-bottom: 20px;
          animation: pulse 2s infinite;
        }

        .error-card h3 {
          color: #880A0A;
          font-size: 24px;
          margin: 0 0 12px 0;
        }

        .error-card p {
          color: #666;
          margin: 0 0 24px 0;
        }

        .btn-primary {
          background: linear-gradient(135deg, #880A0A 0%, #A01010 100%);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(136, 10, 10, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(136, 10, 10, 0.4);
        }

        .cart-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #FFFEF9 0%, #FFF9F0 50%, #FFFEF9 100%);
          background-size: 200% 200%;
          animation: gradientShift 15s ease infinite;
          padding: 40px 20px 80px;
          position: relative;
          overflow: hidden;
        }

        .cart-page::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(201, 169, 97, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 20s ease-in-out infinite;
        }

        .cart-page::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(136, 10, 10, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 25s ease-in-out infinite reverse;
        }

        .cart-container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .page-header {
          text-align: center;
          margin-bottom: 48px;
          animation: fadeInUp 0.6s ease;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          background: white;
          padding: 20px 40px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(136, 10, 10, 0.1);
          border: 2px solid #F5E6C8;
          position: relative;
          overflow: hidden;
        }

        .header-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(201, 169, 97, 0.2), transparent);
          animation: shimmer 3s infinite;
        }

        .header-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #880A0A 0%, #A01010 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 15px rgba(136, 10, 10, 0.3);
        }

        .header-title {
          font-size: clamp(24px, 5vw, 32px);
          font-weight: 800;
          background: linear-gradient(135deg, #880A0A 0%, #C9A961 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .step-progress {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
        }

        .step-circle.active {
          background: linear-gradient(135deg, #880A0A 0%, #A01010 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(136, 10, 10, 0.4);
          transform: scale(1.1);
        }

        .step-circle.completed {
          background: linear-gradient(135deg, #C9A961 0%, #D4B876 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(201, 169, 97, 0.3);
        }

        .step-circle.inactive {
          background: white;
          color: #999;
          border: 2px solid #E0E0E0;
        }

        .step-label {
          font-size: 13px;
          font-weight: 600;
          color: #666;
        }

        .step-line {
          width: 60px;
          height: 3px;
          background: #E0E0E0;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .step-line.active::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #880A0A, #C9A961);
          animation: slideInRight 0.6s ease;
        }

        .cart-content {
          animation: fadeInUp 0.6s ease 0.2s both;
        }

        .cart-items-grid {
          display: grid;
          gap: 20px;
          margin-bottom: 32px;
        }

        .cart-item-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(136, 10, 10, 0.06);
          border: 2px solid #F5E6C8;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.5s ease both;
        }

        .cart-item-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #880A0A 0%, #C9A961 100%);
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        .cart-item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(136, 10, 10, 0.12);
          border-color: #C9A961;
        }

        .cart-item-card:hover::before {
          transform: scaleY(1);
        }

        .cart-item-layout {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 20px;
          align-items: center;
        }

        @media (max-width: 640px) {
          .cart-item-layout {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        .product-image-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 16px;
          overflow: hidden;
          border: 3px solid #F5E6C8;
          background: linear-gradient(135deg, #FFFEF9 0%, #FFF9F0 100%);
          transition: all 0.3s ease;
        }

        .product-image-wrapper:hover {
          border-color: #C9A961;
          transform: scale(1.05);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .cart-item-card:hover .product-image {
          transform: scale(1.1);
        }

        .product-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .product-name {
          font-size: 18px;
          font-weight: 700;
          color: #2D2D2D;
          margin: 0;
          line-height: 1.4;
        }

        .product-price-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #FFF9F0 0%, #F5E6C8 100%);
          padding: 10px 20px;
          border-radius: 12px;
          border: 2px solid #E8D5A8;
          width: fit-content;
          transition: all 0.3s ease;
        }

        .cart-item-card:hover .product-price-badge {
          background: linear-gradient(135deg, #F5E6C8 0%, #C9A961 100%);
          border-color: #C9A961;
        }

        .price-value {
          font-size: 20px;
          font-weight: 800;
          color: #880A0A;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .btn-remove {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: #880A0A;
          border: 2px solid #880A0A;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-remove:hover {
          background: #880A0A;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(136, 10, 10, 0.3);
        }

        .total-summary {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(136, 10, 10, 0.08);
          border: 2px solid #F5E6C8;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .total-summary::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #880A0A 0%, #C9A961 50%, #880A0A 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .total-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }

        .total-label {
          font-size: 16px;
          color: #666;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .total-value-box {
          background: linear-gradient(135deg, #FFF9F0 0%, #FFFFFF 100%);
          padding: 20px 40px;
          border-radius: 16px;
          border: 3px solid #C9A961;
          box-shadow: 0 8px 30px rgba(201, 169, 97, 0.2);
          position: relative;
          overflow: hidden;
        }

        .total-value-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(201, 169, 97, 0.1) 0%, transparent 70%);
          animation: pulse 3s infinite;
        }

        .total-amount {
          font-size: clamp(28px, 6vw, 36px);
          font-weight: 900;
          background: linear-gradient(135deg, #880A0A 0%, #A01010 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          z-index: 1;
        }

        .action-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }

        .btn-next {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #880A0A 0%, #A01010 100%);
          color: white;
          border: none;
          padding: 16px 48px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 17px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 8px 30px rgba(136, 10, 10, 0.4);
          position: relative;
          overflow: hidden;
        }

        .btn-next::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-next:hover::before {
          width: 300px;
          height: 300px;
        }

        .btn-next:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 40px rgba(136, 10, 10, 0.5);
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: white;
          color: #880A0A;
          border: 2px solid #880A0A;
          padding: 14px 36px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-back:hover {
          background: #880A0A;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(136, 10, 10, 0.3);
        }

        .empty-cart {
          background: white;
          border-radius: 24px;
          padding: 80px 40px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(136, 10, 10, 0.08);
          border: 2px solid #F5E6C8;
          animation: bounceIn 0.6s ease;
        }

        .empty-icon {
          width: 120px;
          height: 120px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #FFF9F0 0%, #F5E6C8 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 3s ease-in-out infinite;
        }

        .empty-text {
          font-size: 20px;
          font-weight: 700;
          color: #880A0A;
          margin: 0;
        }

        .form-section {
          background: white;
          border-radius: 24px;
          padding: clamp(24px, 4vw, 40px);
          box-shadow: 0 10px 40px rgba(136, 10, 10, 0.08);
          border: 2px solid #F5E6C8;
          margin-bottom: 32px;
          animation: fadeInUp 0.6s ease;
        }

        .form-group {
          margin-bottom: 28px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 700;
          color: #880A0A;
          margin-bottom: 12px;
        }

        .label-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #C9A961 0%, #D4B876 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(201, 169, 97, 0.3);
        }

        .form-input {
          width: 100%;
          border: 2px solid #F5E6C8;
          border-radius: 14px;
          padding: 14px 18px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: #FFFEF9;
        }

        .form-input:focus {
          outline: none;
          border-color: #C9A961;
          box-shadow: 0 0 0 4px rgba(201, 169, 97, 0.15);
          background: white;
          transform: translateY(-1px);
        }

        .form-select {
          width: 100%;
          border: 2px solid #F5E6C8;
          border-radius: 14px;
          padding: 14px 18px;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #FFFEF9;
        }

        .form-select:focus {
          outline: none;
          border-color: #C9A961;
          box-shadow: 0 0 0 4px rgba(201, 169, 97, 0.15);
          background: white;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #880A0A;
          margin-top: 8px;
          animation: slideInRight 0.3s ease;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(136, 10, 10, 0.2);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeInUp 0.3s ease;
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(136, 10, 10, 0.2);
          overflow: hidden;
          animation: bounceIn 0.5s ease;
        }

        .modal-header {
          background: linear-gradient(135deg, #FFF9F0 0%, #FFFFFF 100%);
          padding: 24px;
          border-bottom: 2px solid #F5E6C8;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #880A0A;
          margin: 0;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #F5E6C8;
          color: #880A0A;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: #880A0A;
          color: white;
          transform: rotate(90deg);
        }

        .modal-body {
          padding: 24px;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 2px solid #F5E6C8;
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-modal-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #880A0A 0%, #A01010 100%);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(136, 10, 10, 0.3);
        }

        .btn-modal-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(136, 10, 10, 0.4);
        }

        .btn-modal-secondary {
          background: white;
          color: #880A0A;
          border: 2px solid #880A0A;
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-modal-secondary:hover {
          background: #880A0A;
          color: white;
        }

        @media (max-width: 768px) {
          .cart-page {
            padding: 20px 16px 60px;
          }

          .header-badge {
            padding: 16px 24px;
          }

          .step-line {
            width: 30px;
          }

          .product-image-wrapper {
            width: 100px;
            height: 100px;
          }

          .total-value-box {
            padding: 16px 24px;
          }

          .btn-next, .btn-back {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="cart-page">
        <div className="cart-container">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-badge">
              <div className="header-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h1 className="header-title">سبد خرید شما</h1>
            </div>

            {/* Step Progress */}
            <div className="step-progress">
              <div className="step-item">
                <div
                  className={`step-circle ${step >= 1 ? (step > 1 ? "completed" : "active") : "inactive"}`}
                >
                  {step > 1 ? "✓" : "1"}
                </div>
                <span className="step-label">سبد خرید</span>
              </div>
              <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
              <div className="step-item">
                <div
                  className={`step-circle ${step >= 2 ? (step > 2 ? "completed" : "active") : "inactive"}`}
                >
                  {step > 2 ? "✓" : "2"}
                </div>
                <span className="step-label">اطلاعات</span>
              </div>
              <div className={`step-line ${step >= 3 ? "active" : ""}`}></div>
              <div className="step-item">
                <div
                  className={`step-circle ${step >= 3 ? "active" : "inactive"}`}
                >
                  3
                </div>
                <span className="step-label">پرداخت</span>
              </div>
            </div>
          </div>

          {/* Cart Content */}
          <div className="cart-content">{renderStep()}</div>
        </div>
      </div>
    </MainLayout>
  );
};

// Step 1: Review Cart

const CartReview = ({
  cartItems,
  nextStep,
  handleQuantityChange,
  handleRemoveItem,
  sum,
}) => (
  <div className="cart-content">
    {cartItems?.data?.length === 0 ? (
      <div className="empty-cart">
        <div className="empty-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C9A961"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <p className="empty-text">سبد خرید شما خالی است</p>
      </div>
    ) : (
      <>
        {/* Cart Items */}
        <div className="cart-items-grid">
          {cartItems?.data?.map((item, index) => (
            <div
              key={item.id}
              className="cart-item-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="cart-item-layout">
                {/* Product Image */}
                <div className="product-image-wrapper">
                  <img
                    src={`https://python.krabo.gold${item?.product?.image}`}
                    alt="Product Image"
                    className="product-image"
                  />
                </div>

                {/* Product Details */}
                <div className="product-details">
                  <h3 className="product-name">{item.product.name}</h3>
                  <div className="product-price-badge">
                    <NumberFormat
                      className="price-value"
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={" تومان"}
                      value={round(item?.property / 10, 0)}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    حذف محصول
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div className="total-summary">
          <div className="total-content">
            <div className="total-label">

              جمع کل سبد خرید
            </div>
            <div className="total-value-box">
              <NumberFormat
                className="total-amount"
                displayType={"text"}
                thousandSeparator={true}
                suffix={" تومان"}
                value={round(sum / 10, 0)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <button className="btn-next" onClick={nextStep}>
            ادامه به مرحله بعد
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>
      </>
    )}
  </div>
);

// Step 2: User Info Form
const UserInfoForm = ({ userInfo, setUserInfo, nextStep, prevStep, setId, factorId, setFactorId }) => {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showAddressError, setShowAddressError] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    post_code: "",
  });

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const token = localStorage.getItem("userInfoKrabo")
          ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
          : null;

        if (!token) {
          throw new Error("No token found");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          "https://python.krabo.gold/api/user/my-address/",
          { headers },
        );

        setAddresses(response?.data);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    }

    fetchAddresses();
  }, []);

  const handleAddressChange = (e) => {
    setShowAddressError(false);
    const { value } = e.target;
    console.log(`test -> ${e.target.value}`);
    if (value === "new") {
      setShowNewAddressForm(true);
      setSelectedAddress("");
    } else {
      setSelectedAddress(value);
      setUserInfo({ ...userInfo, address: value });
      setShowNewAddressForm(false);
    }
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleNewAddressSubmit = async () => {
    try {
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
        "https://python.krabo.gold/api/user/my-address/",
        newAddress,
        { headers },
      );

      if (response.status === 201) {
        setAddresses([...addresses, response.data]);
        setSelectedAddress(response?.data?.id);
        setUserInfo({ ...userInfo, address: response?.data?.id });
        setShowNewAddressForm(false);
      }
    } catch (error) {
      console.error("Failed to add address:", error);
    }
  };
  ///////////////

  async function create_pre_invoice() {
    try {
      const token = localStorage.getItem("userInfoKrabo")
        ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
        : null;

      if (!token) {
        throw new Error("No token found");
      }
      const typeAds = localStorage.getItem("where") || "";

      if (userInfo.name !== "" && userInfo.address !== "") {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const response = await axios.post(
          "https://python.krabo.gold/api/order/pre-invoice/",
          {
            address: userInfo?.address,
            name: userInfo?.name,
            type_ads: typeAds,
          },
          { headers },
        );

        const newFactorId = response?.data?.data?.id;
        setFactorId(newFactorId); // ✅ ذخیره id فاکتور در state
        setId(newFactorId); // ذخیره در state والد (اختیاری)

        // ❌ حذف این خط:
        // router.push(`/factor/${response?.data?.data?.id}`);
      } else {
        userInfo.name === "" && setShowNameError(true);
        userInfo.address === "" && setShowAddressError(true);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  return (
    <div className="cart-content">
      <div className="form-section">
        <form>
          {/* Name Input */}
          <div className="form-group">
            <label className="form-label">
              <div className="label-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              نام و نام خانوادگی
            </label>
            <input
              required
              className="form-input"
              placeholder="نامی که میخواهید در فاکتور ثبت شود..."
              onChange={(e) => {
                setUserInfo({ ...userInfo, name: e.target.value });
                setShowNameError(false);
              }}
            />
            {showNameError && (
              <div className="error-message">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                حتما نام و نام خانوادگی را درج کنید
              </div>
            )}
          </div>

          {/* Address Select */}
          <div className="form-group">
            <label className="form-label">
              <div className="label-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              انتخاب آدرس
            </label>
            <select
              className="form-select"
              value={selectedAddress}
              onChange={handleAddressChange}
            >
              <option value="">انتخاب آدرس</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.name} - {addr.address}, {addr.city}, {addr.post_code}
                </option>
              ))}
              <option
                value="new"
                style={{ color: "#880A0A", fontWeight: "600" }}
              >
                + اضافه کردن آدرس جدید
              </option>
            </select>
            {showAddressError && (
              <div className="error-message">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                حتما آدرس را انتخاب کنید
              </div>
            )}
          </div>

          {showNewAddressForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">اضافه کردن آدرس جدید</h4>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => setShowNewAddressForm(false)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    name="name"
                    placeholder="نام"
                    value={newAddress.name}
                    onChange={handleNewAddressChange}
                    className="form-input"
                    style={{ marginBottom: "12px" }}
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="آدرس"
                    value={newAddress.address}
                    onChange={handleNewAddressChange}
                    className="form-input"
                    style={{ marginBottom: "12px" }}
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="شهر"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    className="form-input"
                    style={{ marginBottom: "12px" }}
                  />
                  <input
                    type="text"
                    name="post_code"
                    placeholder="کد پستی"
                    value={newAddress.post_code}
                    onChange={handleNewAddressChange}
                    className="form-input"
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-modal-primary"
                    onClick={handleNewAddressSubmit}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    </svg>
                    ذخیره آدرس
                  </button>
                  <button
                    type="button"
                    className="btn-modal-secondary"
                    onClick={() => setShowNewAddressForm(false)}
                  >
                    لغو
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* 
          <div>
            <h style={{ margin: 10 }}>پرداخت</h>
          </div> */}
        </form>
      </div>

      {/* Action Buttons */}
      {/* دکمه‌های عملیات */}
      <div className="action-section">
        {!factorId ? (
          // اگر فاکتور هنوز ایجاد نشده
          <button className="btn-next" onClick={create_pre_invoice}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            ایجاد پیش فاکتور
          </button>
        ) : (
          // ✅ اگر فاکتور ایجاد شده - دکمه‌های پرداخت و مشاهده فاکتور
          <>
            <button
              style={{
                backgroundColor: "rgb(111 10 10)",
                color: "white",
                border: "none",
                margin: "10px",
                padding: "10px",
                borderRadius: "10px",
                fontSize: "28px",
              }}
              onClick={() => {
                window.open(
                  `http://krabo.gold:3421/api/order/go-to-geteway/?id=${factorId}`,
                  "_blank"
                );
              }}
            >
              پرداخت
            </button>
            <button
              className="btn-next"
              onClick={() => router.push(`/factor/${factorId}`)}
            >
              مشاهده فاکتور
            </button>
          </>
        )}

        <button className="btn-back" onClick={prevStep}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          بازگشت به سبد خرید
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
