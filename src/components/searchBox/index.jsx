import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/router";
import LoadingBar from "@components/loadingBar";

function SearchWithDropdown() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);
  const [isFocused, setIsFocused] = useState(false);

  const timerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        fetchProducts(searchTerm);
      }, 800);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProducts = async (searchTerm) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/search", {
        params: {
          searchTerm: searchTerm,
          page: page,
        },
      });
      if (page === 1) {
        setSearchResults(data?.product || []);
      } else {
        setSearchResults((prev) => [...prev, ...(data?.product || [])]);
      }
      setPageNumber(data?.page);
      setShowDropdown(true);
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
    if (term) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setSearchResults([]);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowDropdown(false);
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && searchResults.length > 0) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchProducts(searchTerm);
    }
  }, [page]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "16px 0",
        background: "linear-gradient(135deg, #fefaf5 0%, #fff5eb 100%)",
        borderBottom: "1px solid rgba(136,10,10,0.1)",
      }}
    >
      <div
        ref={dropdownRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "80%",
          maxWidth: "700px",
          position: "relative",
        }}
      >
        {/* Input Container */}
        <div
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <input
            type="text"
            placeholder="جستجو در کرابو..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: "100%",
              padding: "14px 50px 14px 45px",
              fontSize: "15px",
              border: `2px solid ${isFocused || searchTerm ? "#880a0a" : "#e0d5c5"}`,
              borderRadius: "50px",
              backgroundColor: "#ffffff",
              color: "#2d2d2d",
              outline: "none",
              transition: "all 0.3s ease",
              boxShadow: isFocused
                ? "0 4px 20px rgba(136,10,10,0.15)"
                : "0 2px 8px rgba(0,0,0,0.05)",
              fontFamily: "inherit",
            }}
          />

          {/* Search Icon - Left Side */}
          <button
            onClick={() => fetchProducts(searchTerm)}
            style={{
              position: "absolute",
              left: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "linear-gradient(135deg, #880a0a, #6b0506)",
              border: "none",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(136,10,10,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(136,10,10,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(136,10,10,0.3)";
            }}
          >
            <FontAwesomeIcon
              icon={faSearch}
              style={{ width: "16px", color: "#fff" }}
            />
          </button>

          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={handleClear}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#999",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f0f0";
                e.currentTarget.style.color = "#880a0a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#999";
              }}
            >
              <FontAwesomeIcon icon={faTimes} style={{ width: "14px" }} />
            </button>
          )}
        </div>

        {/* Dropdown for search results */}
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              left: 0,
              right: 0,
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              border: "1px solid rgba(136,10,10,0.15)",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)",
              zIndex: 1000,
              overflow: "hidden",
              animation: "slideDown 0.25s ease-out",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "12px 20px",
                backgroundColor: "#fefaf5",
                borderBottom: "1px solid rgba(136,10,10,0.1)",
              }}
            >
              <span
                style={{ fontSize: "13px", color: "#880a0a", fontWeight: 600 }}
              >
                🔍 نتایج جستجو ({searchResults.length})
              </span>
            </div>

            {/* Results List */}
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                padding: "8px",
              }}
              onScroll={(e) => {
                const element = e.target;
                if (
                  element.scrollHeight - element.scrollTop <=
                  element.clientHeight + 50
                ) {
                  loadMore();
                }
              }}
            >
              {searchResults.map((result, index) => (
                <div
                  key={result.id || index}
                  onClick={() => {
                    router.push(
                      `/product/${result.main_category?.slug}/${result.sub_category?.slug}/${result.slug}/`,
                    );
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "12px",
                    margin: "6px 0",
                    borderRadius: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    backgroundColor: "#ffffff",
                    border: "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fefaf5";
                    e.currentTarget.style.borderColor = "rgba(136,10,10,0.2)";
                    e.currentTarget.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {/* Product Image */}
                  <div
                    style={{
                      width: "55px",
                      height: "55px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      backgroundColor: "#f5f0eb",
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
                      onError={(e) => {
                        e.target.src = "/assets/img/placeholder.png";
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#2d2d2d",
                        marginBottom: "4px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {result.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#880a0a" }}>
                      {result.main_category?.name} / {result.sub_category?.name}
                    </div>
                  </div>

                  {/* Price */}
                  {result.price && (
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#ff8c00",
                        flexShrink: 0,
                      }}
                    >
                      {new Intl.NumberFormat("fa-IR").format(result.price)}{" "}
                      تومان
                    </div>
                  )}
                </div>
              ))}

              {/* Loading More */}
              {loading && (
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <LoadingBar />
                </div>
              )}

              {/* No Results */}
              {!loading && searchResults.length === 0 && searchTerm && (
                <div
                  style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                    🔍
                  </div>
                  <div style={{ fontSize: "14px" }}>
                    نتیجه‌ای برای "{searchTerm}" یافت نشد
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default SearchWithDropdown;
