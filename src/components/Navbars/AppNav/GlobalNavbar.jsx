// components/GlobalNavbar.jsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef, useMemo } from "react";
import { createGlobalStyle } from "styled-components";
import axios from "axios";
import NumberFormat from "react-number-format";
import { round } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

const GlobalStyles = createGlobalStyle`
  :root {
    --primary: #8B0000;
    --primary-dark: #6B0000;
    --primary-light: #f17b33;
    --primary-gradient: linear-gradient(135deg, #8B0000 0%, #6B0000 100%);
    --accent: #DAA520;
    --bg-light: #fefaf5;
    --bg-white: #ffffff;
    --text-dark: #2d2d2d;
    --text-light: #666666;
    --shadow-sm: 0 4px 15px rgba(0,0,0,0.05);
    --shadow-md: 0 8px 25px rgba(0,0,0,0.08);
    --shadow-lg: 0 15px 35px rgba(0,0,0,0.1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', 'Vazir', system-ui, sans-serif;
    background: var(--bg-light);
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
  }

  .main-header {
    background: white;
    border-bottom: 2px solid #000;
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    position: relative;
  }

  .gold-price-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    background: linear-gradient(135deg, #fef5e7, #fff8f0);
    padding: 8px 15px;
    border-radius: 12px;

  }

  .gold-label-new {
    font-size: 13px;
    color: #666;
    font-weight: 500;
  }

  .gold-value-new {
    font-size: 18px;
    font-weight: 800;
    color: #8B0000;
    direction: ltr;
  }

  .logo-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .logo-center img {
    cursor: pointer;
    width: 250px;
    height: auto;
    transition: transform 0.3s ease;
  }

  .logo-center img:hover {
    transform: scale(1.02);
  }

  .header-icons {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 22px;
    color: #000;
    transition: all 0.3s ease;
    padding: 8px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-btn:hover {
    color: #8B0000;
    background: rgba(139, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .gold-blink {
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    border-radius: 50%;
    animation: blink 1.5s ease-in-out infinite;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
    display: inline-block;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.9); }
  }

  .search-btn-desktop {
    background: #8B0000;
    border: 2px solid #8B0000;
    padding: 8px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    color: #fff;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search-btn-desktop:hover {
    background: transparent;
    color: #8B0000;
    transform: translateY(-2px);
  }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #000;
    padding: 8px;
  }

  .nav-menu-horizontal {
    background: linear-gradient(135deg, #ffffff 0%, #faf9f8 100%);
    border-top: 1px solid rgba(0,0,0,0.08);
    border-bottom: 3px solid transparent;
    border-image: linear-gradient(90deg, #000000, #000000, #000000);
    border-image-slice: 1;
    position: relative;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }

  .nav-menu-horizontal::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #8B0000 25%, #000000 50%, #8B0000 75%, transparent 100%);
    animation: borderGlow 3s ease-in-out infinite;
  }

  @keyframes borderGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .menu-horizontal-list {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0;
    position: relative;
  }

  .menu-horizontal-item {
    position: relative;
    flex: 1;
    text-align: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .menu-horizontal-item::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #8B0000, #DAA520);
    transition: all 0.4s ease;
    transform: translateX(-50%);
  }

  .menu-horizontal-item:hover::before {
    width: 80%;
  }

  .menu-horizontal-link {
    display: block;
    padding: 18px 24px;
    color: #2c3e50;
    text-decoration: none;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.5px;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .menu-horizontal-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(139,0,0,0.05), transparent);
    transition: left 0.5s ease;
  }

  .menu-horizontal-link:hover::before {
    left: 100%;
  }

  .menu-horizontal-link:hover {
    color: #8B0000;
    transform: translateY(-2px);
  }

  .menu-horizontal-item:hover {
    background: linear-gradient(135deg, rgba(139,0,0,0.03), rgba(218,165,32,0.02));
    transform: translateY(-3px);
  }

  .dropdown-menu-edit {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0, 0, 0, 0.15);
    padding: 24px;
    min-width: 300px;
    max-width: 85vw;
    width: max-content;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 1000;
    margin-top: 0;
    right: auto;
    left: 50%;
  }

  .menu-horizontal-item:hover .dropdown-menu-edit {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }

  .dropdown-items-edit {
    padding: 16px 20px;
    flex: 1 1 auto;
    min-width: 190px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
  }

  .dropdown-items-edit:hover {
    transform: translateY(-5px) translateX(-2px);
    box-shadow: 0 8px 25px rgba(139,0,0,0.12);
    background: linear-gradient(135deg, #ffffff, #fffaf5);
  }

  .dropdown-title {
    font-weight: 700;
    background: linear-gradient(135deg, #8B0000, #DAA520);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    margin-bottom: 16px;
    font-size: 18px;
    position: relative;
    display: inline-block;
    letter-spacing: 0.5px;
  }

  .dropdown-title::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #8B0000, #DAA520);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .dropdown-items-edit:hover .dropdown-title::after {
    width: 70px;
  }

  .subDropDown {
    list-style: none;
    padding-right: 0;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .subDropDown li a {
    display: block;
    padding: 6px 0;
    color: #5a6e7a;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    position: relative;
  }

  .subDropDown li a:hover {
    color: #8B0000;
    padding-right: 20px;
    transform: translateX(5px);
  }

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    animation: slideDown 0.5s ease;
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .search-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 9999;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 100px;
    animation: fadeIn 0.2s ease;
  }

  .search-modal-content {
    background: white;
    border-radius: 16px;
    padding: 24px;
    width: 90%;
    max-width: 700px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    animation: slideDownModal 0.3s ease;
  }

  @keyframes slideDownModal {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 9998;
    animation: fadeIn 0.3s ease;
  }

  .mobile-menu-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    background: white;
    z-index: 9999;
    overflow-y: auto;
    animation: slideInRight 0.3s ease;
    box-shadow: -4px 0 20px rgba(0,0,0,0.2);
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  .mobile-menu-header {
    padding: 20px;
    border-bottom: 2px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mobile-menu-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #000;
  }

  .mobile-menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .mobile-menu-item {
    border-bottom: 1px solid #f0f0f0;
  }

  .mobile-menu-link {
    display: block;
    padding: 16px 20px;
    color: #000;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
  }

  .mobile-menu-link:hover {
    background: #f5f5f5;
    color: var(--primary);
  }

  .mobile-submenu {
    list-style: none;
    padding: 0;
    margin: 0;
    background: #fafafa;
  }

  .mobile-submenu-item {
    padding: 12px 20px 12px 40px;
    border-bottom: 1px solid #f0f0f0;
  }

  .mobile-submenu-title {
    font-weight: 600;
    color: var(--primary);
    font-size: 14px;
    margin-bottom: 8px;
  }

  .mobile-submenu-link {
    display: block;
    padding: 6px 0;
    color: var(--text-light);
    text-decoration: none;
    font-size: 13px;
  }

  @media (max-width: 1200px) {
    .menu-horizontal-link { padding: 14px 16px; font-size: 14px; }
    .dropdown-menu-edit { min-width: 400px; }
  }

  @media (max-width: 992px) {
    .gold-value-new { font-size: 14px; }
    .menu-horizontal-link { padding: 12px 12px; font-size: 13px; }
    .dropdown-menu-edit { min-width: 350px; }
  }

  @media (max-width: 768px) {
    .header-top { padding: 15px 0; }
    .logo-center { position: static; transform: none; order: 2; flex: 1; text-align: center; }
    .logo-center img { width: 150px !important; }
    .gold-price-left { order: 1; flex-shrink: 0; padding: 5px 10px; }
    .gold-label-new { font-size: 9px; }
    .gold-value-new { font-size: 11px; }
    .header-icons { order: 3; gap: 10px; flex-shrink: 0; }
    .icon-btn { font-size: 20px; width: 35px; height: 35px; }
    .search-btn-desktop { display: none !important; }
    .login-btn-desktop { display: none !important; }
    .search-icon-mobile { display: block !important; }
    .mobile-menu-btn { display: block; }
    .nav-menu-horizontal { display: none; }
    .search-modal-overlay { padding-top: 20px; }
    .search-modal-content { padding: 16px; border-radius: 12px; }
  }

  @media (max-width: 480px) {
    .gold-label-new { font-size: 8px; }
    .gold-value-new { font-size: 10px; }
    .header-icons { gap: 8px; }
    .icon-btn { font-size: 18px; width: 32px; height: 32px; }
  }
`;

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
      timerRef.current = setTimeout(() => fetchProducts(searchTerm), 600);
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
      console.log(error);
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
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="جستجو در کرابو..."
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
            style={{
              width: "100%",
              padding: "14px 50px 14px 50px",
              fontSize: "15px",
              border: "2px solid #8B0000",
              borderRadius: "40px",
              backgroundColor: "#ffffff",
              color: "#2d2d2d",
              outline: "none",
            }}
          />
          <button
            onClick={() => fetchProducts(searchTerm, 1)}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "linear-gradient(135deg, #8B0000, #6B0000)",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon
              icon={faSearch}
              style={{ width: "16px", color: "#fff" }}
            />
          </button>
          {searchTerm && (
            <button
              onClick={handleClear}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#999",
              }}
            >
              <FontAwesomeIcon icon={faTimes} style={{ width: "14px" }} />
            </button>
          )}
        </div>
        {searchResults.length > 0 && (
          <div
            style={{ maxHeight: "400px", overflowY: "auto" }}
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderBottom: "1px solid #f0f0f0",
                  borderRadius: "8px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fefaf5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fff")
                }
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#f5f0eb",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={`https://python.krabo.gold${result.image}`}
                    alt={result.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#2d2d2d",
                    }}
                  >
                    {result.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8B0000" }}>
                    {result.main_category?.name}
                  </div>
                </div>
                {result.price && (
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#DAA520",
                    }}
                  >
                    {new Intl.NumberFormat("fa-IR").format(result.price)} تومان
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ padding: "16px", textAlign: "center" }}>
                در حال بارگذاری...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileMenuComponent({ isOpen, onClose, header, isLogin, router }) {
  const [expandedMenu, setExpandedMenu] = useState(null);
  if (!isOpen) return null;

  return (
    <>
      <div className="mobile-menu-overlay" onClick={onClose} />
      <div className="mobile-menu-sidebar">
        <div className="mobile-menu-header">
          <span
            className="logo-text"
            style={{ fontSize: "24px", letterSpacing: "4px" }}
          >
            KRABO
          </span>
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
          {!isLogin && (
            <li className="mobile-menu-item">
              <span
                className="mobile-menu-link"
                onClick={() => {
                  router.push("/login");
                  onClose();
                }}
                style={{ color: "var(--primary)", fontWeight: 600 }}
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

const GlobalNavbar = ({
  navbarRef,
  headerData,
  location,
  searchShow = true,
}) => {
  const safeHeader = useMemo(() => {
    if (!headerData) return { menu: [] };
    if (headerData.menu) return headerData;
    if (headerData.data?.menu) return headerData.data;
    return { menu: [] };
  }, [headerData]);

  const [goldPrice, setGoldPrice] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [count_card, set_count_card] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  async function fetchData() {
    try {
      const token = localStorage.getItem("userInfoKrabo")
        ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
        : null;
      if (!token) return;
      const response = await axios.get(
        "https://python.krabo.gold/api/order/my-card/",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
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
    setIsLogin(!!localStorage.getItem("userInfoKrabo"));
    const interval = setInterval(fetchGoldPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  if (!safeHeader.menu || safeHeader.menu.length === 0) {
    return null;
  }

  return (
    <>
      <GlobalStyles />
      <div className="sticky-header">
        <div className="main-header">
          <div
            className="container"
            style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}
          >
            <div className="header-top">
              <div className="header-icons">
                <button
                  className="icon-btn search-icon-mobile"
                  onClick={() => setIsSearchOpen(true)}
                  style={{ display: "none" }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>

                {isLogin && (
                  <Link href="/profile">
                    <button className="icon-btn">
                      <FontAwesomeIcon icon={faUser} />
                    </button>
                  </Link>
                )}

                {!isLogin && (
                  <button
                    className="login-btn-desktop"
                    onClick={() => router.push("/login")}
                    style={{
                      background: "transparent",
                      border: "2px solid #8B0000",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#000",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#8B0000";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#000";
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    ورود
                  </button>
                )}

                <button
                  className="search-btn-desktop"
                  onClick={() => setIsSearchOpen(true)}
                  style={{
                    background: "#8B0000",
                    border: "2px solid #8B0000",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    color: "#fff",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#8B0000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#8B0000";
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ width: "14px", color: "inherit" }}
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

              <div className="logo-center">
                <Link href="/">
                  <img src="/assets/img/logo1.png" alt="KRABO" />
                </Link>
              </div>
              <div className="gold-price-left">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span className="gold-label-new">قیمت لحظه‌ای طلا</span>
                  <span className="gold-blink"></span>
                </div>
                {goldPrice ? (
                  <div className="gold-value-new">
                    تومان{" "}
                    <NumberFormat
                      displayType="text"
                      thousandSeparator={true}
                      value={Math.round(goldPrice / 10)}
                    />{" "}
                  </div>
                ) : (
                  <span className="gold-value-new">در حال دریافت...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="nav-menu-horizontal">
          <div
            className="container"
            style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}
          >
            <ul className="menu-horizontal-list">
              {safeHeader.menu.map((data_menu, index) => (
                <li key={index} className="menu-horizontal-item">
                  <Link href={data_menu.url || "#"}>
                    <span className="menu-horizontal-link">
                      {data_menu.title}
                    </span>
                  </Link>
                  {data_menu.menu_item?.length > 0 && (
                    <div className="dropdown-menu-edit">
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {data_menu.menu_item.map((menu_title, idx) => (
                          <div key={idx} className="dropdown-items-edit">
                            <div className="dropdown-title">
                              {menu_title.title}
                            </div>
                            <ul className="subDropDown">
                              {menu_title.item?.map((menu, subIdx) => (
                                <li key={subIdx}>
                                  <Link href={menu.url}>
                                    <span>{menu.name}</span>
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
      <MobileMenuComponent
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        header={safeHeader}
        isLogin={isLogin}
        router={router}
      />
    </>
  );
};

export default GlobalNavbar;
