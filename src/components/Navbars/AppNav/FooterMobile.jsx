import React, { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import Link from "next/link";

const GlobalStyles = createGlobalStyle`
  /* Side menu hidden by default */
  .msb {
    width: 0;
    overflow: hidden;
    transition: width 0.3s ease;
    background-color: #fff;
    position: fixed;
    top: 0;
    right: 0; /* تغییر به راست برای زبان فارسی (RTL) */
    height: 100vh;
    box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  }

  .msb.show {
    width: 300px;
    overflow-y: auto;
  }

  /* Additional styles */
  .side-menu-container {
    width: 100%;
    padding: 10px;
  }

  .accordion-button {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    width: 100%;
    text-align: right;
    background: none;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .accordion-collapse {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
  }

  .accordion-collapse.show-content {
    max-height: 1000px; /* مقدار تقریبی برای انیمیشن روان */
    transition: max-height 0.5s ease-in;
  }

  .menu-item-link {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 8px 25px;
    line-height: 1.5;
    color: #333;
    text-decoration: none;
  }

  /* Footer mobile styles */
  .footer-mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    z-index: 1000;
    padding: 10px;
    border-top: 1px solid #ccc;
  }

  .footer-mobile ul {
    display: flex;
    justify-content: space-around;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .footer-mobile li {
    text-align: center;
    cursor: pointer;
  }

  .li-footer {
    color: #212529;
  }

  .li-footer.active {
    color: #880a0a;
  }

  .static-link {
    display: block;
    padding: 15px 20px;
    margin-top: 5px;
    width: 95%;
    color: #212529;
    text-decoration: none;
    border-bottom: 1px solid #f0f0f0;
  }
`;

function FooterMobile({ location, header }) {
  const [isLogin, setIsLogin] = useState(false);
  const [number, setNumber] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  // تعریف استیت برای ذخیره ایندکس منوی باز شده
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfoKrabo");
    setIsLogin(!!userInfo);

    const cartNumber = localStorage.getItem("cartNumber") || 0;
    setNumber(parseInt(cartNumber, 10));
  }, []);

  const toggleSideMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleAccordionToggle = (index) => {
    // اگر دوباره روی همون کلیک شد بسته بشه، در غیر این صورت منوی جدید باز بشه
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <>
      <GlobalStyles />

      {/* Side menu */}
      <div
        className={`msb ${menuVisible ? "show" : ""}`}
        id="msb"
        style={{ zIndex: 1001 }}
      >
        <nav className="navbar navbar-default" style={{ direction: "rtl" }}>
          <div
            className="navbar-header"
            style={{
              textAlign: "center",
              color: "#2A0202",
              padding: "15px 0",
              fontWeight: "bolder",
            }}
          >
            <div className="brand-wrapper">
              <div className="brand-name-wrapper">
                <span className="navbar-brand">منو کرابو</span>
              </div>
            </div>
          </div>

          {/* Render menu items */}
          {header?.menu?.length > 0 &&
            header.menu.map((data_menu, index) => {
              const isOpen = openAccordion === index;
              return (
                <div key={index} className="side-menu-container">
                  <div className="accordion">
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button"
                          type="button"
                          onClick={() => handleAccordionToggle(index)}
                        >
                          {data_menu.title}
                          <span>{isOpen ? "▲" : "▼"}</span>
                        </button>
                      </h2>
                      <div
                        className={`accordion-collapse ${isOpen ? "show-content" : ""}`}
                      >
                        <div
                          className="accordion-body"
                          style={{ padding: "10px 0" }}
                        >
                          {data_menu.menu_item?.map((menu_title, idx) => (
                            <div key={idx} style={{ marginBottom: "10px" }}>
                              <span
                                className="dropdown-item"
                                style={{
                                  color: "#880a0a",
                                  fontWeight: "bolder",
                                  padding: "5px 15px",
                                  display: "block",
                                }}
                              >
                                • {menu_title.title}
                              </span>
                              {menu_title.item?.map((menu, subIdx) => (
                                <Link
                                  key={subIdx}
                                  href={menu.url}
                                  passHref
                                  legacyBehavior
                                >
                                  <a className="menu-item-link">{menu.name}</a>
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Other static links */}
          <Link href="/questions" passHref legacyBehavior>
            <a className="static-link">سوالات متداول</a>
          </Link>
          <Link href="/contactUs" passHref legacyBehavior>
            <a className="static-link">تماس با ما</a>
          </Link>
          <Link href="/rules" passHref legacyBehavior>
            <a className="static-link">قوانین و مقررات</a>
          </Link>
        </nav>
      </div>

      {/* Footer mobile */}
      <div
        style={{ zIndex: 1002 }}
        className="footer-mobile container-fluid d-md-none"
      >
        <ul className="show-mobile-flex" style={{ gap: "30px" }}>
          <Link href="/" passHref legacyBehavior>
            <a>
              <li
                className={`li-footer ${location === "home" ? "active" : ""}`}
              >
                <i className="bi bi-house" style={{ fontSize: "25px" }}></i>
                <div>کرابو</div>
              </li>
            </a>
          </Link>
          <li className="li-footer" onClick={toggleSideMenu}>
            <i className="bi bi-list" style={{ fontSize: "25px" }}></i>
            <div>دسته بندی</div>
          </li>
          <Link href="/ShoppingCart" passHref legacyBehavior>
            <a>
              <li className="li-footer" style={{ position: "relative" }}>
                <i className="bi bi-cart" style={{ fontSize: "25px" }}></i>
                <span
                  className="badge bg-danger"
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-10px",
                    fontSize: "12px",
                    padding: "5px 7px",
                    borderRadius: "50%",
                    color: "white",
                  }}
                >
                  {number}
                </span>
                <div>سبد خرید</div>
              </li>
            </a>
          </Link>
          <Link href={isLogin ? "/profile" : "/login"} passHref legacyBehavior>
            <a>
              <li className="li-footer">
                <i className="bi bi-person" style={{ fontSize: "25px" }}></i>
                <div>حساب کاربری</div>
              </li>
            </a>
          </Link>
        </ul>
      </div>
    </>
  );
}

export default FooterMobile;
