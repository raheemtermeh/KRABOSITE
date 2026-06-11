import { useEffect, useState } from "react";
import Link from "next/link";
import NumberFormat from "react-number-format";
import { round } from "lodash";
import FooterMobile from "@components/Product/FooterMobile";
import axios from "axios";
import { useRouter } from "next/router";
import LoadingOverlay from "@components/loadingOverlay";

const TabContent = ({ isActive, id, product }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [Image, SetImage] = useState(null);

  const [IdPrice, SetIdPrice] = useState({});

  const [SizeList, SetSizeList] = useState(null);

  const [WeightList, SetWeightList] = useState(null);

  const [AccessoryList, SetAccessoryList] = useState(null);

  const router = useRouter();

  const handleAdd = async (e) => {
    e.preventDefault();

    const token =
      typeof window !== "undefined" && localStorage.getItem("userInfoKrabo")
        ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
        : null;

    // Handle cart animation
    const cartElement = document.querySelector(".chart-desktop");
    if (cartElement) {
      cartElement.classList.add("shake");
      setTimeout(() => {
        cartElement.classList.remove("shake");
      }, 500);
    }

    // Redirect to login if token is not available
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://python.krabo.gold/api/order/add-to-card/",
        {
          product: product.data._id,
          count: 1,
          property: IdPrice.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      router.push("/ShoppingCart/");
      const totalItemsElement = document.querySelector("#cart-2");
      if (totalItemsElement) {
        totalItemsElement.setAttribute("data-totalitems", response.data.count);
      }
    } catch (error) {
      setError(
        "خطا! " +
          (error.response ? error.response.data.message : "بعدا تلاش کنید"),
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const size_default = () => {
    SetSizeList(
      Array.from(new Set(product.data.properties.map((item) => item.size))),
    );
  };

  const weight_default = () => {
    SetWeightList(
      Array.from(new Set(product.data.properties.map((item) => item.weight))),
    );
  };

  const accessory_default = () => {
    SetAccessoryList(
      Array.from(
        new Set(product.data.properties.map((item) => item.accessory__name)),
      ),
    );
  };

  useEffect(() => {
    // حذف کامل اسکریپت تغییر موقعیت sticky/fixed
    // فقط مقداردهی اولیه را نگه می‌داریم

    let one = product.data.properties[0];
    SetIdPrice({
      id: one.id,
      price: one.price,
      size: one.size ? [one.size] : [],
      weight: one.weight ? [one.weight] : [],
      accessory: one.accessory__name ? [one.accessory__name] : [],
    });

    if ((product.data && product.data?.size) || !SizeList) {
      size_default();
    }

    if (product.data?.weight || !WeightList) {
      weight_default();
    }

    if (product.data?.accessory || !AccessoryList) {
      accessory_default();
    }
  }, []);

  return (
    <>
      <LoadingOverlay isLoading={loading} />

      <div
        className={`tab-pane ${isActive ? "show active" : ""} fade`}
        id={id}
        role="tabpanel"
      >
        <div className="faq-body">
          <div className="">
            <div className="row gx-6" style={{ padding: "9px" }}>
              {/* باکس سمت چپ - بدون اسکریپل تغییر موقعیت */}
              <div className="col-lg-3 hide-mobile ">
                <div
                  className="faq-category product-sidebar-box"
                  style={{
                    background:
                      "linear-gradient(0deg,hsla(240,3%,94%,.5),hsla(240,3%,94%,.5)),#fff",
                    boxShadow:
                      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                    textAlign: "center",
                    width: "100%",
                    padding: "13px",
                    position: "sticky",
                    top: "20px",
                    alignSelf: "flex-start",
                  }}
                >
                  <div className="row">
                    <div className="col-lg-5">
                      <img
                        alt={Image ? Image.alt : product.title_seo}
                        id="main-image"
                        src={
                          Image
                            ? Image.image
                            : `https://python.krabo.gold/${product.data.image}`
                        }
                        style={{
                          width: "89%",
                          height: "auto",
                          borderRadius: "20px",
                        }}
                      />
                    </div>

                    <div className="col-lg-7">
                      <h5
                        onClick={() => {}}
                        className="text-uppercase"
                        style={{ color: "black" }}
                      >
                        {product.data.name}
                      </h5>
                      <hr
                        className="hr hr-blurry"
                        style={{ color: "#ff6000" }}
                      />
                      {IdPrice.size && IdPrice.size.length > 0 && (
                        <h3
                          style={{
                            color: "black",
                            fontSize: "12px",
                            direction: "rtl",
                            float: "right",
                            fontWeight: "10",
                          }}
                        >
                          سایز:
                          {IdPrice.size}سانتی متر
                        </h3>
                      )}

                      {IdPrice.weight && IdPrice.weight.length > 0 && (
                        <>
                          <br />
                          <h3
                            style={{
                              color: "black",
                              fontSize: "12px",
                              direction: "rtl",
                              float: "right",
                              fontWeight: "10",
                            }}
                          >
                            وزن:
                            {IdPrice.weight}
                            گرم
                          </h3>
                        </>
                      )}

                      {IdPrice.accessory && IdPrice.accessory.length > 0 && (
                        <>
                          <br />
                          <h3
                            style={{
                              color: "black",
                              fontSize: "12px",
                              direction: "rtl",
                              float: "right",
                              fontWeight: "10",
                            }}
                          >
                            اکسسوری:
                            {IdPrice.accessory}
                          </h3>
                        </>
                      )}
                    </div>
                  </div>

                  <br />

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
                    value={round(IdPrice.price / 10, 0)}
                  />

                  <br />
                  <br />
                  <button
                    style={{ direction: "rtl", width: "89%" }}
                    onClick={handleAdd}
                    className="btn rounded-pill bg-blue4 fw-bold text-white "
                  >
                    <small>
                      <i className="fa fa-shopping-cart me-2 pe-2 border-end"></i>
                      افزودن به سبد خرید
                    </small>
                  </button>
                </div>
              </div>

              {/* بخش راست - محتوای اصلی */}
              <div className="col-lg-9">
                <div className="">
                  <div className="row d-flex ">
                    <div className="col-md-12">
                      <div className="card" style={{ direction: "rtl" }}>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="product-gallery">
                              {/* تصویر اصلی */}
                              <div className="main-image-container">
                                <img
                                  alt={Image ? Image.alt : product.title_seo}
                                  id="main-image"
                                  src={
                                    Image
                                      ? Image.image
                                      : `https://python.krabo.gold/${product.data.image}`
                                  }
                                  className="main-product-image"
                                />
                              </div>

                              {/* تصاویر ثانویه (گالری) */}
                              {product.data.gallery.length > 0 && (
                                <div className="thumbnail-gallery">
                                  {product.data.gallery.map(
                                    (gallery, index) => (
                                      <div
                                        key={index}
                                        className={`thumbnail-item ${Image && Image?.index === gallery.name ? "active" : ""}`}
                                        onClick={() => {
                                          SetImage({
                                            index: gallery.name,
                                            alt: gallery.name,
                                            image: `https://python.krabo.gold/media/${gallery.image}`,
                                          });
                                        }}
                                      >
                                        <img
                                          alt={gallery.name}
                                          src={`https://python.krabo.gold/media/${gallery.image}`}
                                          className="thumbnail-image"
                                        />
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>

                            <style jsx>{`
                              .product-gallery {
                                width: 100%;
                                display: flex;
                                flex-direction: column;
                                gap: 1rem;
                              }

                              /* تصویر اصلی */
                              .main-image-container {
                                width: 100%;
                                aspect-ratio: 1 / 1;
                                background: linear-gradient(
                                  135deg,
                                  #f5f7fa 0%,
                                  #f0f2f5 100%
                                );
                                border-radius: 24px;
                                overflow: hidden;
                                position: relative;
                                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                                transition: all 0.3s ease;
                              }

                              .main-image-container:hover {
                                transform: scale(1.01);
                                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                              }

                              .main-product-image {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                transition: transform 0.4s ease;
                                cursor: zoom-in;
                              }

                              .main-image-container:hover .main-product-image {
                                transform: scale(1.05);
                              }

                              /* گالری تصاویر ثانویه */
                              .thumbnail-gallery {
                                display: flex;
                                flex-direction: row;
                                justify-content: center;
                                gap: 0.75rem;
                                flex-wrap: wrap;
                                margin-top: 0.5rem;
                              }

                              .thumbnail-item {
                                width: calc(25% - 0.75rem);
                                min-width: 70px;
                                max-width: 100px;
                                aspect-ratio: 1 / 1;
                                background: white;
                                border-radius: 16px;
                                overflow: hidden;
                                cursor: pointer;
                                transition: all 0.25s ease;
                                border: 2px solid transparent;
                                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                              }

                              .thumbnail-item:hover {
                                transform: translateY(-3px);
                                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
                                border-color: #d4af37;
                              }

                              .thumbnail-item.active {
                                border-color: #880a0a;
                                box-shadow: 0 4px 12px rgba(136, 10, 10, 0.2);
                                position: relative;
                              }

                              .thumbnail-item.active::after {
                                content: "";
                                position: absolute;
                                bottom: -6px;
                                left: 50%;
                                transform: translateX(-50%);
                                width: 30px;
                                height: 3px;
                                background: #880a0a;
                                border-radius: 2px;
                              }

                              .thumbnail-image {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                transition: all 0.3s ease;
                              }

                              .thumbnail-item:hover .thumbnail-image {
                                transform: scale(1.1);
                              }

                              /* ریسپانسیو برای موبایل */
                              @media (max-width: 768px) {
                                .product-gallery {
                                  gap: 0.875rem;
                                }

                                .main-image-container {
                                  border-radius: 20px;
                                }

                                .thumbnail-gallery {
                                  gap: 0.625rem;
                                }

                                .thumbnail-item {
                                  width: calc(25% - 0.625rem);
                                  min-width: 60px;
                                  border-radius: 14px;
                                }
                              }

                              @media (max-width: 576px) {
                                .thumbnail-gallery {
                                  gap: 0.5rem;
                                }

                                .thumbnail-item {
                                  width: calc(25% - 0.5rem);
                                  min-width: 55px;
                                  border-radius: 12px;
                                }

                                .thumbnail-item.active::after {
                                  width: 20px;
                                  bottom: -4px;
                                }
                              }

                              @media (max-width: 480px) {
                                .thumbnail-item {
                                  min-width: 50px;
                                }
                              }

                              /* اضافه کردن افکت زوم برای دسکتاپ */
                              @media (min-width: 992px) {
                                .main-product-image {
                                  cursor: zoom-in;
                                }
                              }
                            `}</style>
                          </div>
                          <div className="col-md-6">
                            <div className="product p-4">
                              <div className="mt-4 mb-3">
                                <nav aria-label="breadcrumb text-uppercase text-muted brand">
                                  <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                      <Link href="/">کرابو</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                      <Link
                                        href={`/product/${product.data.main_category.slug}`}
                                      >
                                        {product.data.main_category.name}
                                      </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                      <Link
                                        href={`/product/${product.data.main_category.slug}/${product.data.sub_category.slug}`}
                                      >
                                        {product.data.sub_category.name}
                                      </Link>
                                    </li>
                                    <li
                                      className="breadcrumb-item active"
                                      aria-current="page"
                                    >
                                      {product.data.name}
                                    </li>
                                  </ol>
                                </nav>

                                <h1 className="text-uppercase">
                                  {product.data.name}
                                </h1>
                              </div>
                              <hr className="hr hr-blurry" />

                              <div className="cart mt-4 align-items-center">
                                <p
                                  onClick={() => {
                                    let one = product.data.properties[0];
                                    SetIdPrice({
                                      id: one.id,
                                      price: one.price,
                                      size: one.size ? [one.size] : [],
                                      weight: one.weight ? [one.weight] : [],
                                      accessory: one.accessory_name
                                        ? [one.accessory_name]
                                        : [],
                                    });
                                    size_default();
                                    weight_default();
                                    accessory_default();
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    color: "#880a0a",
                                  }}
                                >
                                  ریست کردن فیلتر
                                </p>
                                <br />

                                <div
                                  className="row gx-6"
                                  style={{ padding: "9px" }}
                                >
                                  {product.data.size &&
                                    product.data.size.length > 0 && (
                                      <div className="col-lg-4">
                                        <p className="grow text-h5 text-neutral-900">
                                          <span className="relative">
                                            اندازه
                                          </span>
                                        </p>
                                        <br />
                                        <select
                                          className="form-select"
                                          onChange={(e) => {
                                            const selectedSize = parseInt(
                                              e.target.value,
                                            );

                                            const filteredProperties =
                                              product.data.properties.filter(
                                                (item) =>
                                                  item.size === selectedSize,
                                              );

                                            const uniqueAccessorySet =
                                              Array.from(
                                                new Set(
                                                  filteredProperties.map(
                                                    (item) =>
                                                      item.accessory__name
                                                        ? item.accessory__name
                                                        : "ندارد",
                                                  ),
                                                ),
                                              );
                                            const newAccessoryList = [
                                              ...uniqueAccessorySet,
                                            ];

                                            const uniqueWeightSet = Array.from(
                                              new Set(
                                                filteredProperties.map(
                                                  (item) => item.weight,
                                                ),
                                              ),
                                            );
                                            const newWeightList = [
                                              ...uniqueWeightSet,
                                            ];

                                            SetWeightList(newWeightList);
                                            SetAccessoryList(newAccessoryList);

                                            SetIdPrice({
                                              id: filteredProperties[0].id,
                                              price:
                                                filteredProperties[0].price,
                                              size: filteredProperties[0].size
                                                ? [filteredProperties[0].size]
                                                : [],
                                              weight: filteredProperties[0]
                                                .weight
                                                ? [filteredProperties[0].weight]
                                                : [],
                                              accessory: filteredProperties[0]
                                                .accessory__name
                                                ? [
                                                    filteredProperties[0]
                                                      .accessory__name,
                                                  ]
                                                : [],
                                            });
                                          }}
                                          aria-label="Default select example"
                                        >
                                          {SizeList &&
                                            SizeList.length > 0 &&
                                            SizeList.map((size, index) => (
                                              <option
                                                key={index}
                                                selected={
                                                  IdPrice.size
                                                    ? IdPrice.size == size
                                                    : null
                                                }
                                              >
                                                {size}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    )}
                                  {product.data.weight &&
                                    product.data.weight.length > 0 && (
                                      <div className="col-lg-4">
                                        <p className="grow text-h5 text-neutral-900">
                                          <span className="relative">وزن</span>
                                        </p>
                                        <br />
                                        <select
                                          className="form-select"
                                          onChange={(e) => {
                                            const selectedWeight = parseFloat(
                                              e.target.value,
                                            );

                                            const filteredProperties =
                                              product.data.properties.filter(
                                                (item) =>
                                                  parseFloat(item.weight) ===
                                                  parseFloat(selectedWeight),
                                              );

                                            const uniqueSizes = Array.from(
                                              new Set(
                                                filteredProperties.map(
                                                  (item) => item.size,
                                                ),
                                              ),
                                            );
                                            const newSizeList = [
                                              ...uniqueSizes,
                                            ];

                                            const uniqueAccessorySet =
                                              Array.from(
                                                new Set(
                                                  filteredProperties.map(
                                                    (item) =>
                                                      item.accessory__name
                                                        ? item.accessory__name
                                                        : "ندارد",
                                                  ),
                                                ),
                                              );
                                            SetAccessoryList([
                                              ...uniqueAccessorySet,
                                            ]);

                                            SetSizeList(newSizeList);

                                            SetIdPrice({
                                              id: filteredProperties[0].id,
                                              price:
                                                filteredProperties[0].price,
                                              size: filteredProperties[0].size
                                                ? [filteredProperties[0].size]
                                                : [],
                                              weight: filteredProperties[0]
                                                .weight
                                                ? [filteredProperties[0].weight]
                                                : [],
                                              accessory: filteredProperties[0]
                                                .accessory__name
                                                ? [
                                                    filteredProperties[0]
                                                      .accessory__name,
                                                  ]
                                                : [],
                                            });
                                          }}
                                          aria-label="Default select example"
                                        >
                                          {WeightList &&
                                            WeightList.length > 0 &&
                                            WeightList.map((weight, index) => (
                                              <option
                                                key={index}
                                                selected={
                                                  IdPrice.weight
                                                    ? parseFloat(
                                                        IdPrice.weight,
                                                      ) == parseFloat(weight)
                                                    : null
                                                }
                                              >
                                                {weight}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    )}

                                  {AccessoryList &&
                                    AccessoryList.length > 0 &&
                                    AccessoryList[0] != null && (
                                      <div className="col-lg-4">
                                        <p className="grow text-h5 text-neutral-900">
                                          <span className="relative">
                                            اکسسوری
                                          </span>
                                        </p>
                                        <br />
                                        <select
                                          className="form-select"
                                          onChange={(e) => {
                                            const selectedAccessory =
                                              e.target.value;

                                            const filteredProperties =
                                              product.data.properties.filter(
                                                (item) =>
                                                  item.accessory__name ===
                                                  selectedAccessory,
                                              );

                                            const uniqueSizes = Array.from(
                                              new Set(
                                                filteredProperties.map(
                                                  (item) => item.size,
                                                ),
                                              ),
                                            );
                                            const newSizeList = [
                                              ...uniqueSizes,
                                            ];

                                            const uniqueWeightSet = Array.from(
                                              new Set(
                                                filteredProperties.map(
                                                  (item) => item.weight,
                                                ),
                                              ),
                                            );
                                            const newWeightList = [
                                              ...uniqueWeightSet,
                                            ];

                                            if (filteredProperties.length > 0) {
                                              SetSizeList(newSizeList);
                                              SetWeightList(newWeightList);

                                              SetIdPrice({
                                                id: filteredProperties[0].id,
                                                price:
                                                  filteredProperties[0].price,
                                                size: filteredProperties[0].size
                                                  ? [filteredProperties[0].size]
                                                  : [],
                                                weight: filteredProperties[0]
                                                  .weight
                                                  ? [
                                                      filteredProperties[0]
                                                        .weight,
                                                    ]
                                                  : [],
                                                accessory: filteredProperties[0]
                                                  .accessory__name
                                                  ? [
                                                      filteredProperties[0]
                                                        .accessory__name,
                                                    ]
                                                  : [],
                                              });
                                            }
                                          }}
                                          aria-label="Default select example"
                                        >
                                          <option key={0}></option>

                                          {AccessoryList &&
                                            AccessoryList.length > 0 &&
                                            AccessoryList.map(
                                              (accessory, index) =>
                                                accessory && (
                                                  <option
                                                    key={index}
                                                    selected={
                                                      IdPrice.accessory
                                                        ? IdPrice.accessory ==
                                                          accessory
                                                        : null
                                                    }
                                                  >
                                                    {accessory}
                                                  </option>
                                                ),
                                            )}
                                        </select>
                                      </div>
                                    )}
                                </div>

                                {product.data.attributes.length > 0 && (
                                  <>
                                    <hr />
                                    <p>ویژگی</p>

                                    <div
                                      className="row gx-6"
                                      style={{
                                        padding: "7px",
                                      }}
                                    >
                                      <ul className="flex-fix">
                                        {product.data.attributes.length > 0 &&
                                          product.data.attributes.map(
                                            (data, index) => (
                                              <li
                                                key={index}
                                                className="attributes"
                                              >
                                                <span className="comment">
                                                  {data.comment}
                                                </span>
                                                <br />
                                              </li>
                                            ),
                                          )}
                                      </ul>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />

                <div className="" style={{ fontFamily: "IRANSansX" }}>
                  <div className="row d-flex ">
                    <div className="col-md-12">
                      <div
                        className=""
                        style={{ direction: "rtl", fontFamily: "IRANSansX" }}
                      >
                        <nav>
                          <div
                            className="nav nav-tabs"
                            id="nav-tab"
                            role="tablist"
                          >
                            <button
                              className="nav-link active"
                              id="nav-home-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-home"
                              type="button"
                              role="tab"
                              aria-controls="nav-home"
                              aria-selected="true"
                            >
                              توضیحات
                            </button>
                            <button
                              className="nav-link"
                              id="nav-profile-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-profile"
                              type="button"
                              role="tab"
                              aria-controls="nav-profile"
                              aria-selected="false"
                            >
                              نظرات
                            </button>
                          </div>
                        </nav>

                        <div className="tab-content" id="nav-tabContent">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: product.data.description,
                            }}
                            className="tab-pane fade show active"
                            id="nav-home"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab"
                            style={{ fontSize: "16px", fontWeight: "light" }}
                          ></div>

                          <div
                            className="tab-pane fade"
                            id="nav-profile"
                            role="tabpanel"
                            aria-labelledby="nav-profile-tab"
                          >
                            فعال نمی باشد
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterMobile
        price={IdPrice.price}
        product={product}
        idPrice={IdPrice.id}
      />
    </>
  );
};

export default TabContent;
