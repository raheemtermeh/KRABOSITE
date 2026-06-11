import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import logo from "../../../public/assets/img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faSync } from "@fortawesome/free-solid-svg-icons";
import MainLayout from "@layouts/Main";

export default function Login() {
  const [captchaToken, setCaptchaToken] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [userName, setUserName] = useState("");
  // const [password, setPassword] = useState("");
  const [countdown, setCountdown] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [error, setError] = useState("");
  const [ValidPhone, SetValidPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [smsToken, setSmsToken] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [name, setName] = useState("");
  //capcha code generating//
  const fetchCaptchaCode = async () => {
    try {
      const response = await fetch(
        "https://python.krabo.gold/api/user/generate-captcha/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCaptchaToken(data?.data?.token);
      setImageUrl(data?.data?.image);
    } catch (error) {
      console.error("Failed to fetch captcha code:", error);
    }
  };

  useEffect(() => {
    !showCode && fetchCaptchaCode();
    const intervalId = setInterval(() => {
      fetchCaptchaCode();
    }, 60000);
    return () => clearInterval(intervalId);
  }, [showCode]);
  ///////////////////////////
  useEffect(() => {
    let timer = null;

    if (isTimerActive) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setIsTimerActive(false);
            return 0; // Stops at 0
          }
          return prevCountdown - 1;
        });
      }, 1000); // Update countdown every second
    }

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [isTimerActive]);

  const startTimer = () => {
    setCountdown(180); // Reset to 180 seconds (3 minutes)
    setIsTimerActive(true);
  };

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  ///////////////////////////
  const sendSmsCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://python.krabo.gold/api/user/code-sms/",
        {
          token_sms: smsToken,
          number: smsCode,
        },
      );

      if (response.status === 200) {
        router.push("/");

        localStorage.setItem(
          "userInfoKrabo",
          JSON.stringify(response.data.data.krabo),
        );
      } else {
        setError("مشکلی پیش آمده است!!!");
      }
    } catch (error) {
      console.log({ error });

      setError(
        "خطا! \n  " +
          (error.response
            ? error.response.data.username?.[0]
            : "بعدا تلاش کنید"),
      );
    } finally {
      setLoading(false);
    }
  };
  ////////////////////////////
  const againSendSmsCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.put(
        "https://python.krabo.gold/api/user/code-sms/",
        {
          token_sms: smsToken,
        },
      );

      if (response.status === 200) {
        console.log("retry");
      } else {
        setError("مشکلی پیش آمده است!!!");
      }
    } catch (error) {
      console.log({ error });

      setError(
        "خطا! \n " +
          (error.response
            ? error.response.data.username?.[0]
            : "بعدا تلاش کنید"),
      );
    } finally {
      setLoading(false);
    }
  };
  ///////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const typeAds = localStorage.getItem("where") || "";
    try {
      const response = await axios.post(
        "https://python.krabo.gold/api/user/register/",
        {
          username: userName,
          nameAndFamily: name,
          password: userName,
          mobile: userName,
          token: captchaToken,
          code: captcha,
          type_ads: typeAds,
        },
      );

      if (response.status === 200) {
        // router.push("/login"); // Redirect to the desired page after successful login
        startTimer();
        setShowCode(true);
        setSmsToken(response.data.data);
      } else {
        setError("مشکلی پیش آمده است!!!");
      }
    } catch (error) {
      console.log({ error });

      setError(
        "خطا! \n " +
          (error.response ? error?.response?.data?.message : "بعدا تلاش کنید"),
      );
    } finally {
      setLoading(false);
    }
  };

  const validateInput = (value) => {
    // Check if the input is exactly 11 digits long and contains only numbers
    if (/^\d{11}$/.test(value)) {
      SetValidPhone(""); // Clear the error if the input is valid
    } else {
      SetValidPhone("لطفا شماره موبایل خود را درست وارد کنید");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    validateInput(value);
  };

  return (
    <MainLayout isRTL>
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center d-none d-md-block mb-4">
          <Image src={logo} alt="logo" className="img-fluid" />
        </div>
        <div
          className="bg-white p-4 shadow rounded"
          style={{ maxWidth: "100%", width: "500px" }}
        >
          <h2
            className="mb-10 text-align-center text-center"
            style={{ color: "#880a0a" }}
          >
            ثبت نام کرابو
          </h2>
          <form onSubmit={handleSubmit}>
            {showCode ? (
              <div>
                <input
                  type="text"
                  id="smsCode"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  required
                  placeholder="کد پیامک شده را وارد کنید"
                  className="form-control"
                  style={{ marginTop: 20 }}
                />
                {isTimerActive ? (
                  <div>
                    <p style={{ marginTop: 10 }}>{formatTime(countdown)}</p>
                  </div>
                ) : (
                  <button
                    className="bg-white border-0"
                    style={{ color: "#880a0a", marginBottom: 10 }}
                    onClick={startTimer && againSendSmsCode}
                  >
                    ارسال مجدد کد{" "}
                    <FontAwesomeIcon
                      icon={faSync}
                      style={{ width: "15px", color: "#880a0a" }}
                    />
                  </button>
                )}
                <button
                  className="btn w-100"
                  style={{ backgroundColor: "#880a0a", color: "#fff" }}
                  onClick={(e) => sendSmsCode(e)}
                >
                  ارسال
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ width: "20px", color: "#bbb" }}
                      />
                    </span>
                    <input
                      type="text"
                      id="nameAndFamily"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="نام و نام خانوادگی"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ width: "20px", color: "#bbb" }}
                      />
                    </span>
                    <input
                      type="text"
                      id="userName"
                      value={userName}
                      onChange={handleChange}
                      required
                      placeholder="شماره موبایل"
                      className="form-control"
                    />
                  </div>
                </div>
                {/* <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon
                        icon={faLock}
                        style={{ width: "20px", color: "#bbb" }}
                      />
                    </span>

                                      
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="پسوورد"
                      className="form-control"
                  />
                  </div>
                </div> */}
                <div className="mb-3 text-center position-relative">
                  {imageUrl && (
                    <img
                      src={`data:image/jpeg;base64,${imageUrl}`}
                      alt="CAPTCHA"
                      className="img-fluid mb-2"
                      style={{ maxWidth: "80%", height: "auto" }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={fetchCaptchaCode}
                    className="btn position-absolute top-50 end-0 translate-middle-y p-1"
                    aria-label="Refresh CAPTCHA"
                  >
                    <FontAwesomeIcon
                      icon={faSync}
                      style={{ width: "20px", color: "#bbb" }}
                    />
                  </button>
                  <input
                    type="text"
                    id="captcha"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    required
                    placeholder="کد امنیتی"
                    className="form-control"
                  />
                </div>
                {error && <p className="text-danger mb-3">{error}</p>}
                <br />
                {ValidPhone && <p className="text-danger mb-3">{ValidPhone}</p>}
                <button
                  type="submit"
                  className="btn w-100"
                  style={{ backgroundColor: "#880a0a", color: "#fff" }}
                  disabled={loading || ValidPhone}
                >
                  {loading ? "در حال ذخیره..." : "ذخیره"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
