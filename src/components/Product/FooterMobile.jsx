import React, { useState } from "react";
import NumberFormat from "react-number-format";
import { round } from "lodash";
import { useRouter } from "next/router";
import axios from "axios";
import Snackbar from "@components/snackBar";
import LoadingOverlay from "@components/loadingOverlay";

function FooterMobile({ price, product, idPrice }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const router = useRouter();

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Retrieve the token from localStorage
    const userInfo = localStorage?.getItem("userInfoKrabo");
    const token = userInfo ? JSON.parse(userInfo)?.token : null;

    // If no token is found, set an error and return early
    if (!token) {
      setLoading(false);
      setError("Token not found. Please login.");
      router.push("/login");
      return;
    }

    try {
      const response = await axios.post(
        "https://python.krabo.gold/api/order/add-to-card/",
        {
          product: product.data._id,
          count: 1,
          property: idPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        // router.push("/");
        setSnackbarVisible(true);
      } else {
        setError("مشکلی پیش آمده است!!!");
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "لطفا بعدا تلاش کنید";
      console.log("Error:", errorMessage);
      setError("خطا! " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarVisible(false);
  };

  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <Snackbar
        message="!کالای شما به سبد خرید افزوده شد "
        show={snackbarVisible}
        onClose={handleCloseSnackbar}
      />
      <div className="show-mobile-flex footer-mobile">
        <div style={{}}>
          <NumberFormat
            className="priceProduct"
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              color: "black",
            }}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"تومان"}
            value={round(price / 10, 0)}
          />
        </div>
        <div style={{}}>
          <a
            style={{
              direction: "rtl",
              padding: "11px 19px",
            }}
            onClick={handleAdd}
            rel="noreferrer"
            className="btn rounded-pill bg-blue4 fw-bold text-white"
            target="_blank"
          >
            <small>
              <i className="fa fa-shopping-cart me-2 pe-2 border-end"></i>
              افزودن به سبد خرید
            </small>
          </a>
        </div>
      </div>
    </>
  );
}

export default FooterMobile;
