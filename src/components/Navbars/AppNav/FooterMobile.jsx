
import React, { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import Link from "next/link";

const GlobalStyles = createGlobalStyle`
  /* Side menu hidden by default */
  .msb {
    width: 0;
    overflow: hidden;
    transition: width 0.3s ease;
  }

  .msb.show {
    width: 300px;
    overflow: auto;
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
  }

  .menu-item-link {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 5px 15px;
    line-height: 1.5;
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

  /* Menu title mobile */
  .menu-title-mobile {
    display: flex;
    justify-content: center;
    font-weight: bold;
    font-size: 19px;
    border-bottom: 1px solid #880a0a;
  }

  .li-footer {
    color: #212529;
  }

  .li-footer.active {
    color: #880a0a;
  }
`;

function FooterMobile({ location, header }) {
  const [isLogin, setIsLogin] = useState(false);
  const [number, setNumber] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfoKrabo");
    setIsLogin(!!userInfo);

    const cartNumber = localStorage.getItem("cartNumber") || 0;
    setNumber(parseInt(cartNumber, 10));
  }, []);

  const toggleSideMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <GlobalStyles />
      
      {/* Side menu */}
      <div className={`msb ${menuVisible ? "show" : ""}`} id="msb" style={{zIndex:1001}}>
        <nav className="navbar navbar-default">
          <div className="navbar-header" style={{textAlign:'center',color:"#2A0202",fontWeight:'bolder'}}>
            <div className="brand-wrapper">
              <div className="brand-name-wrapper">
                <a className="navbar-brand" href="#">
                  منو کرابو
                </a>
              </div>
            </div>
          </div>

          {/* Render menu items */}
          {header?.menu?.length > 0 &&
            header.menu.map((data_menu, index) => (
              <div key={index} className="side-menu-container">
                <div className="accordion" id={`accordion-${index}`}>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id={`heading-${index}`}>
                      <button
                        className={`${
                          // data_menu.menu_item?.length > 0
                            // ?
                             "accordion-button collapsed"
                            // : "no-accordion"
                        }`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${index}`}
                        aria-expanded="false"
                        aria-controls={`collapse-${index}`}
                      >
                        {data_menu.title}
                      </button>
                    </h2>
                    <div
                      id={`collapse-${index}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading-${index}`}
                    >
                      <div className="accordion-body">
                        {data_menu.menu_item?.map((menu_title, idx) => (
                          <div key={idx}>
                            <Link href="#">
                              <a
                                className="dropdown-item"
                                style={{
                                  color: "#880a0a",
                                  fontWeight: "bolder",
                                }}
                              >
                                • {menu_title.title}
                              </a>
                            </Link>
                            {menu_title.item?.map((menu, subIdx) => (
                              <Link key={subIdx} href={menu.url}>
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
            ))}
          
          {/* Other static links */}
          <Link href="/questions">
            <a className="accordion-item" style={{ padding: 20, marginTop: 10, width: "95%" }}>
              سوالات متداول
            </a>
          </Link>
          <Link href="/contactUs">
            <a className="accordion-item" style={{ padding: 20, marginTop: 10, width: "95%" }}>
              تماس با ما
            </a>
          </Link>
          <Link href="/rules">
            <a className="accordion-item" style={{ padding: 20, marginTop: 10, width: "95%" }}>
              قوانین و مقررات
            </a>
          </Link>
        </nav>
      </div>

      {/* Footer mobile */}
      <div style={{zIndex:1002}} className="footer-mobile container-fluid d-md-none">
        <ul className="show-mobile-flex" style={{ gap: "30px" }}>
          <Link href="/">
            <a>
              <li className={`li-footer ${location === "home" ? "active" : ""}`}>
                <i className="bi bi-house" style={{ fontSize: "25px" }}></i>
                کرابو
              </li>
            </a>
          </Link>
          <li className="li-footer" onClick={toggleSideMenu}>
            <i className="bi bi-list" style={{ fontSize: "25px" }}></i>
            دسته بندی
          </li>
          <Link href="/ShoppingCart">
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
                سبد خرید
              </li>
            </a>
          </Link>
          <Link href={isLogin ? "/profile" : "/login"}>
            <a>
              <li className="li-footer">
                <i className="bi bi-person" style={{ fontSize: "25px" }}></i>
                حساب کاربری
              </li>
            </a>
          </Link>
        </ul>
      </div>
    </>
  );
}

export default FooterMobile;
