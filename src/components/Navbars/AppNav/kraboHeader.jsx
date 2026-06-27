import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import NumberFormat from "react-number-format";
import { round } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faShoppingCart,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

function getDropdownPositionClass(index, total) {
  if (index < 2) return "krabo-dropdown-left";
  if (index >= total - 2) return "krabo-dropdown-right";
  return "krabo-dropdown-center";
}

const desktopOutlineBtnClass =
  "flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded border-2 border-krabo-primary bg-transparent px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:bg-krabo-primary hover:text-white";

function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const timerRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const { data } = await axios.get("/api/search", {
            params: { searchTerm, page: 1 },
          });
          setSearchResults(data?.product || []);
          setPage(1);
        } catch (error) {
          (error);
        } finally {
          setLoading(false);
        }
      }, 600);
    } else {
      setSearchResults([]);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchTerm]);

  const fetchProducts = async (searchTerm, pageNum = page) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/search", {
        params: { searchTerm, page: pageNum },
      });
      if (pageNum === 1) {
        setSearchResults(data?.product || []);
      } else {
        setSearchResults((prev) => [...prev, ...(data?.product || [])]);
      }
    } catch (error) {
      (error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setPage(1);
    if (!term) setSearchResults([]);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchResults([]);
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && searchResults.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(searchTerm, nextPage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div
        className="search-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mb-5">
          <input
            type="text"
            placeholder="جستجو در کرابو..."
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
            className="w-full rounded-[40px] border-2 border-krabo-primary bg-white px-[50px] py-3.5 text-[15px] text-krabo-text-dark outline-none"
          />
          <button
            onClick={() => fetchProducts(searchTerm, 1)}
            className="absolute left-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-gradient-to-br from-krabo-primary to-krabo-primary-dark"
          >
            <FontAwesomeIcon icon={faSearch} className="w-4 text-white" />
          </button>
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent text-[#999]"
            >
              <FontAwesomeIcon icon={faTimes} className="w-3.5" />
            </button>
          )}
        </div>
        {searchResults.length > 0 && (
          <div
            className="max-h-[400px] overflow-y-auto"
            onScroll={(e) => {
              if (
                e.target.scrollHeight - e.target.scrollTop <=
                e.target.clientHeight + 50
              )
                loadMore();
            }}
          >
            {searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => {
                  router.push(
                    `/product/${result.main_category?.slug}/${result.sub_category?.slug}/${result.slug}/`,
                  );
                  onClose();
                }}
                className="flex cursor-pointer items-center gap-3 rounded-lg border-b border-[#f0f0f0] p-3 transition-all duration-200 hover:bg-krabo-bg-light"
              >
                <div className="h-[50px] w-[50px] shrink-0 overflow-hidden rounded-[10px] bg-[#f5f0eb]">
                  <img
                    src={`https://python.krabo.gold${result.image}`}
                    alt={result.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-krabo-text-dark">
                    {result.name}
                  </div>
                  <div className="text-xs text-krabo-primary">
                    {result.main_category?.name}
                  </div>
                </div>
                {result.price && (
                  <div className="text-sm font-bold text-krabo-accent">
                    {new Intl.NumberFormat("fa-IR").format(result.price)} تومان
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="p-4 text-center">در حال بارگذاری...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileMenu({ isOpen, onClose, header, isLogin, router }) {
  const [expandedMenu, setExpandedMenu] = useState(null);

  if (!isOpen) return null;

  return (
    <>
      <div className="mobile-menu-overlay" onClick={onClose} />
      <div className="mobile-menu-sidebar">
        <div className="mobile-menu-header">
          <span className="logo-text mobile-logo-text">KRABO</span>
          <button className="mobile-menu-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <ul className="mobile-menu-list">
          {header?.menu?.map((data_menu, index) => (
            <li key={index} className="mobile-menu-item">
              <Link href={data_menu.url}>
                <span
                  className="mobile-menu-link"
                  onClick={() => {
                    if (data_menu.menu_item?.length > 0) {
                      setExpandedMenu(expandedMenu === index ? null : index);
                    } else {
                      onClose();
                    }
                  }}
                >
                  {data_menu.title}
                </span>
              </Link>
              {expandedMenu === index && data_menu.menu_item?.length > 0 && (
                <ul className="mobile-submenu">
                  {data_menu.menu_item.map((menu_title, idx) => (
                    <li key={idx} className="mobile-submenu-item">
                      <div className="mobile-submenu-title">
                        {menu_title.title}
                      </div>
                      {menu_title.item?.map((menu, subIdx) => (
                        <Link key={subIdx} href={menu.url}>
                          <span
                            className="mobile-submenu-link"
                            onClick={onClose}
                          >
                            {menu.name}
                          </span>
                        </Link>
                      ))}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          <li className="mobile-menu-item">
            <Link href="/ShoppingCart">
              <span
                className="mobile-menu-link font-semibold text-krabo-primary"
                onClick={onClose}
              >
                🛒 سبد خرید
              </span>
            </Link>
          </li>

          {isLogin && (
            <li className="mobile-menu-item">
              <Link href="/profile">
                <span
                  className="mobile-menu-link font-semibold text-krabo-primary"
                  onClick={onClose}
                >
                  👤 پروفایل من
                </span>
              </Link>
            </li>
          )}

          {!isLogin && (
            <li className="mobile-menu-item">
              <span
                className="mobile-menu-link font-semibold text-krabo-primary"
                onClick={() => {
                  router.push("/login");
                  onClose();
                }}
              >
                ورود / ثبت نام
              </span>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

const Navbar = ({ navbarRef, header, location, status, searchShow }) => {
  const [goldPrice, setGoldPrice] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [count_card, set_count_card] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const safeHeader = React.useMemo(() => {
    let headerData;
    if (!header) headerData = { menu: [] };
    else if (header.menu) headerData = header;
    else if (header.data?.menu) headerData = header.data;
    else headerData = { menu: [] };

    if (
      headerData.menu &&
      headerData.menu.length >= 3 &&
      headerData.menu[0]?.title === "زنانه"
    ) {
      const reordered = [...headerData.menu];
      const firstItem = reordered.splice(0, 1)[0];
      reordered.splice(2, 0, firstItem);
      return { ...headerData, menu: reordered };
    }

    return headerData;
  }, [header]);

  async function fetchData() {
    try {
      const token = localStorage.getItem("userInfoKrabo")
        ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
        : null;
      if (!token) return;
      const response = await axios.get(
        "https://python.krabo.gold/api/order/my-card/",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const number = response?.data?.data?.length || 0;
      localStorage.setItem("cartNumber", number);
      set_count_card(number);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  const fetchGoldPrice = async () => {
    try {
      const response = await axios.get(
        "https://python.krabo.gold/api/scrape/get-gold/",
      );
      if (response.data) setGoldPrice(response.data.data);
    } catch (error) {
      console.error("Failed to fetch gold price:", error.message);
    }
  };

  useEffect(() => {
    set_count_card(localStorage.getItem("cartNumber"));
    fetchGoldPrice();
    fetchData();
    setIsLogin(localStorage.getItem("userInfoKrabo"));
    const interval = setInterval(fetchGoldPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  if (!safeHeader.menu || safeHeader.menu.length === 0) {
    console.warn("Navbar: No menu items available");
    return null;
  }

  const menuTotal = safeHeader.menu.length;

  return (
    <>
      <div className="sticky-header">
        <div className="main-header">
          <div className="container">
            <div className="header-top">
              <div className="logo-center">
                <Link href="/">
                  <img
                    src="/assets/img/logo1.png"
                    alt="KRABO"
                    className="cursor-pointer"
                  />
                </Link>
              </div>

              <div className="header-icons">
                <button
                  className="icon-btn search-icon-mobile"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>

                {isLogin && (
                  <Link href="/profile">
                    <button className="icon-btn profile-icon-mobile">
                      <FontAwesomeIcon icon={faUser} />
                    </button>
                  </Link>
                )}

                <Link href="/ShoppingCart">
                  <button className="icon-btn cart-icon-mobile relative">
                    <FontAwesomeIcon icon={faShoppingCart} />
                    {count_card > 0 && (
                      <span className="cart-count">{count_card}</span>
                    )}
                  </button>
                </Link>

                {isLogin && (
                  <Link href="/profile">
                    <button
                      className={`profile-btn-desktop ${desktopOutlineBtnClass}`}
                    >
                      <FontAwesomeIcon icon={faUser} className="w-3.5" />
                      پروفایل
                    </button>
                  </Link>
                )}

                <Link href="/ShoppingCart">
                  <button
                    className={`cart-btn-desktop ${desktopOutlineBtnClass} relative`}
                  >
                    <FontAwesomeIcon
                      icon={faShoppingCart}
                      className="w-3.5"
                    />
                    سبد خرید
                    {count_card > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-krabo-primary text-[10px] font-bold text-white">
                        {count_card}
                      </span>
                    )}
                  </button>
                </Link>

                {!isLogin && (
                  <button
                    className={`login-btn-desktop ${desktopOutlineBtnClass}`}
                    onClick={() => router.push("/login")}
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
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    ورود
                  </button>
                )}

                <button
                  className="search-btn-desktop flex shrink-0 cursor-pointer items-center whitespace-nowrap rounded border-2 border-krabo-primary bg-krabo-primary px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-transparent hover:text-krabo-primary"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="w-3.5 text-inherit"
                  />
                  جستجو
                </button>

                <button
                  className="mobile-menu-btn"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
              </div>

              <div className="gold-price-left">
                <div className="flex items-center gap-2">
                  <span className="gold-label-new">قیمت لحظه‌ای طلا</span>
                  <span className="gold-blink"></span>
                </div>
                {goldPrice ? (
                  <div className="gold-value-new">
                    <NumberFormat
                      displayType="text"
                      thousandSeparator={true}
                      value={round(goldPrice / 10, 0)}
                    />{" "}
                    تومان
                  </div>
                ) : (
                  <span className="gold-value-new">در حال دریافت...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="nav-menu-horizontal">
          <div className="container">
            <ul className="menu-horizontal-list">
              {safeHeader.menu.map((data_menu, index) => (
                <li
                  key={index}
                  className={`menu-horizontal-item ${getDropdownPositionClass(index, menuTotal)}`}
                >
                  <Link href={data_menu.url || "#"}>
                    <span className="menu-horizontal-link">
                      {data_menu.title}
                    </span>
                  </Link>
                  {data_menu.menu_item?.length > 0 && (
                    <div className="dropdown-menu-edit">
                      <div className="dropdown-grid">
                        {data_menu.menu_item.map((menu_title, idx) => (
                          <div key={idx} className="dropdown-items-edit">
                            <div className="dropdown-title">
                              {menu_title.title}
                            </div>
                            <ul className="subDropDown">
                              {menu_title.item?.map((menu, subIdx) => (
                                <li key={subIdx}>
                                  <Link href={menu.url}>
                                    <span className="submenu-link">
                                      {menu.name}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        header={safeHeader}
        isLogin={isLogin}
        router={router}
      />
    </>
  );
};

export default Navbar;
