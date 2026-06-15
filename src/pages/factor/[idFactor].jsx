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
        <div className="container mt-5 text-center">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-3">در حال دریافت اطلاعات فاکتور...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !myFactor?.data) {
    return (
      <MainLayout isRTL>
        <div className="container mt-5">
          <div className="alert alert-danger text-center">
            <h4>خطا در دریافت اطلاعات</h4>
            <p>{error || "فاکتور مورد نظر یافت نشد"}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => router.push("/profile")}
            >
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
        `}</style>

        {/* دکمه‌های عملیات */}
        <div
          className="container mt-4 mb-4 no-print"
          style={{ textAlign: "center" }}
        >
          {/* ✅ دکمه پرداخت جدید (بر اساس کد دوم) */}
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
                `http://krabo.gold:3421/api/order/go-to-geteway/?id=${id}`,
                "_blank" // مقدار "_bank" از کد اصلی به "_blank" اصلاح شد
              );
            }}
          >
            پرداخت
          </button>

          <button
            className="btn mx-2"
            onClick={generatePNG}
            disabled={isGenerating}
            style={{
              padding: "10px 30px",
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#6f0a0a",
              color: "white",
              border: "none",
            }}
          >
            {isGenerating ? "در حال ایجاد..." : "دانلود فاکتور"}
          </button>
          <button
            className="btn mx-2"
            onClick={() => router.push("/profile")}
            style={{
              padding: "10px 30px",
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#e0e0e0",
              color: "#333",
              border: "none",
            }}
          >
            بازگشت
          </button>
        </div>

        {/* صفحه فاکتور */}
        <div
          className="container factor-page"
          style={{
            maxWidth: "900px",
            backgroundColor: "white",
            boxShadow: "0 0 20px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "50px",
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