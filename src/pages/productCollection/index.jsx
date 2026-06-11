import LoadingBar from "@components/loadingBar";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import NumberFormat from "react-number-format";
import { round } from "lodash";
const styles = {
  productList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    fontFamily: "IRANSansX",
    backgroundColor: "#f8f9fa",
    marginTop: 200,
  },
  productCard: {
    width: "300px",
    border: "1px solid #880a0a",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative", // Ensure proper positioning for the button
  },
  productCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
  },
  productImage: {
    width: "100%",
    height: "auto",
  },
  productInfo: {
    padding: "15px",
    textAlign: "left",
  },
  productName: {
    fontSize: "1.2em",
    color: "#333",
    margin: "10px 0",
  },
  productDescription: {
    fontSize: "0.9em",
    color: "#555",
    marginBottom: "10px",
  },
  productButton: {
    position: "absolute", // Position the button at the bottom of the card
    bottom: "10px",
    left: "10px",
    right: "10px",
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#880a0a",
    color: "#fff",
    fontSize: "16px",
    textTransform: "uppercase",
    cursor: "pointer",
    visibility: "hidden", // Initially hidden
    opacity: 0, // Fade effect
    transition: "visibility 0.3s, opacity 0.3s ease",
  },
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "300px",
    zIndex: 1000,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};

const ProductCollection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [gender, setGender] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const fetchProducts = async (gender) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://python.krabo.gold/api/product-filter/?gender=${gender}&main_category__slug=${selectedType}&page=${page}&properties__help_price__gte=${maxPrice}&properties__help_price__lte=${minPrice}`,
      );
      const data = response.data;
      setProducts((prev) => [...prev, ...data.product]);
      setTotalPage(data.page);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 &&
      (page < totalPage || page === totalPage)
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useMemo(() => {
    fetchProducts(gender);
  }, [page]);

  useEffect(() => {
    if (
      router.query.gender ||
      router.query.price__lte ||
      router.query.price__gte
    ) {
      setGender(router.query.gender);
      setMinPrice(router.query.price__lte);
      setMaxPrice(router.query.price__gte);
      fetchProducts(router.query.gender);
    }
  }, [router.query.gender, selectedType]);

  const handleFilterChange = (e) => {
    setSelectedType(e.target.value);
  };

  return (
    <>
      <div
        style={{
          fontSize: "20px",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#ccc",
          borderRadius: "50px",
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-around",
          direction: "rtl",
          padding: "10px",
          flexWrap: "wrap",
          position: "fixed",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div>
          <p style={{ color: "#222", fontSize: "22px", fontWeight: "bold" }}>
            فیلتر محصولات :
          </p>
        </div>
        <div>
          <div
            className="form-group"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {[
              "womens-gold-ring",
              "necklaces",
              "bracelets",
              "earrings",
              "nameplate",
            ].map((type) => (
              <div
                className="form-check"
                key={type}
                style={{ paddingRight: "22px" }}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="productType"
                  id={type}
                  value={type}
                  checked={selectedType === type}
                  onChange={handleFilterChange}
                />
                <label
                  style={{ color: "#333" }}
                  className="form-check-label"
                  htmlFor={type}
                >
                  {type === "womens-gold-ring"
                    ? "انگشتر"
                    : type === "necklaces"
                      ? "گردنبند"
                      : type === "bracelets"
                        ? "دستبند"
                        : type === "nameplate"
                          ? "گردنبند اسم"
                          : "گوشواره"}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={styles.productList}>
        {products?.map((product) => (
          <div
            key={product._id}
            style={styles.productCard}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("button").style.visibility =
                "visible";
              e.currentTarget.querySelector("button").style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("button").style.visibility =
                "hidden";
              e.currentTarget.querySelector("button").style.opacity = "0";
            }}
          >
            <img
              src={`https://python.krabo.gold${product.image}`}
              alt={product.name}
              style={styles.productImage}
            />
            <div style={{ textAlign: "center" }}>
              <p>{product.name}</p>
              <p>
                <NumberFormat
                  className="priceProduct"
                  style={{
                    fontWeight: "bold",
                    fontSize: "29px",
                    color: "black",
                  }}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"تومان"}
                  value={round(product.properties[0].price / 10, 0)}
                />
              </p>
            </div>
            <button
              style={styles.productButton}
              onClick={() => {
                router.push(
                  `/product/${product?.main_category?.slug}/${product?.sub_category?.slug}/${product?.slug}/`,
                );
              }}
            >
              خرید
            </button>
          </div>
        ))}
      </div>
      {loading && <LoadingBar />}
    </>
  );
};

export default ProductCollection;
