import { useState, useEffect, useRef, useCallback } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useRouter } from "next/router";
import NumberFormat from "react-number-format";

const Filter = ({
  style = "4",
  rtl,
  state,
  setState,
  event_list,
  header,
  product,
  price__lte,
  price__gte,
  weight__lte,
  weight__gte,
  size__lte,
  size__gte,
  path,
}) => {

  const router = useRouter();
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [weightRange, setWeightRange] = useState([0, 0]);
  const [sizeRange, setSizeRange] = useState([0, 0]);
  const [Event, setEvent] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // تنظیمات پیش‌فرض (در صورت نبودن در API)
  const DEFAULT_MIN_WEIGHT = 1;
  const DEFAULT_MAX_WEIGHT = 10;
  const DEFAULT_MIN_SIZE = 10;
  const DEFAULT_MAX_SIZE = 30;

  // دریافت مین و مکس از API
  const minWeightFromApi = product?.data?.setting?.weight?.min;
  const maxWeightFromApi = product?.data?.setting?.weight?.max;
  const minSizeFromApi = product?.data?.setting?.size?.min;
  const maxSizeFromApi = product?.data?.setting?.size?.max;

  // استفاده از مقادیر API یا پیش‌فرض
  const MIN_WEIGHT =
    minWeightFromApi !== undefined && minWeightFromApi !== null
      ? Number(minWeightFromApi)
      : DEFAULT_MIN_WEIGHT;
  const MAX_WEIGHT =
    maxWeightFromApi !== undefined && maxWeightFromApi !== null
      ? Number(maxWeightFromApi)
      : DEFAULT_MAX_WEIGHT;
  const MIN_SIZE =
    minSizeFromApi !== undefined && minSizeFromApi !== null
      ? Number(minSizeFromApi)
      : DEFAULT_MIN_SIZE;
  const MAX_SIZE =
    maxSizeFromApi !== undefined && maxSizeFromApi !== null
      ? Number(maxSizeFromApi)
      : DEFAULT_MAX_SIZE;


  // مقداردهی اولیه
  useEffect(() => {
    if (product?.data?.setting?.price && !isReady) {
      const minPrice = Number(product.data.setting.price.min);
      const maxPrice = Number(product.data.setting.price.max);

      // قیمت
      let gtePrice =
        price__gte && price__gte !== "" ? Number(price__gte) : minPrice;
      let ltePrice =
        price__lte && price__lte !== "" ? Number(price__lte) : maxPrice;
      gtePrice = Math.max(minPrice, Math.min(maxPrice, gtePrice));
      ltePrice = Math.max(minPrice, Math.min(maxPrice, ltePrice));
      if (gtePrice > ltePrice) [gtePrice, ltePrice] = [ltePrice, gtePrice];

      // وزن
      let gteWeight =
        weight__gte && weight__gte !== "" ? Number(weight__gte) : MIN_WEIGHT;
      let lteWeight =
        weight__lte && weight__lte !== "" ? Number(weight__lte) : MAX_WEIGHT;
      gteWeight = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, gteWeight));
      lteWeight = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, lteWeight));
      if (gteWeight > lteWeight)
        [gteWeight, lteWeight] = [lteWeight, gteWeight];

      // سایز
      let gteSize =
        size__gte && size__gte !== "" ? Number(size__gte) : MIN_SIZE;
      let lteSize =
        size__lte && size__lte !== "" ? Number(size__lte) : MAX_SIZE;
      gteSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, gteSize));
      lteSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, lteSize));
      if (gteSize > lteSize) [gteSize, lteSize] = [lteSize, gteSize];


      setPriceRange([gtePrice, ltePrice]);
      setWeightRange([gteWeight, lteWeight]);
      setSizeRange([gteSize, lteSize]);
      setIsReady(true);
    }
  }, [
    product?.data?.setting?.price,
    price__gte,
    price__lte,
    weight__gte,
    weight__lte,
    size__gte,
    size__lte,
    isReady,
    MIN_WEIGHT,
    MAX_WEIGHT,
    MIN_SIZE,
    MAX_SIZE,
  ]);

  const priceSliderChange = useCallback((value) => setPriceRange(value), []);
  const weightSliderChange = useCallback((value) => setWeightRange(value), []);
  const sizeSliderChange = useCallback((value) => setSizeRange(value), []);

  const handleReset = useCallback(
    (e) => {
      e.preventDefault();
      if (product?.data?.setting?.price) {
        const minPrice = Number(product.data.setting.price.min);
        const maxPrice = Number(product.data.setting.price.max);
        setPriceRange([minPrice, maxPrice]);
        setWeightRange([MIN_WEIGHT, MAX_WEIGHT]);
        setSizeRange([MIN_SIZE, MAX_SIZE]);
        setEvent([]);
        router.push(path);
      }
    },
    [product, path, router, MIN_WEIGHT, MAX_WEIGHT, MIN_SIZE, MAX_SIZE],
  );

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();

    const minPrice = Number(product?.data?.setting?.price?.min);
    const maxPrice = Number(product?.data?.setting?.price?.max);

    // قیمت
    if (priceRange[0] && priceRange[0] !== minPrice) {
      params.append("price__gte", priceRange[0]);
    }
    if (priceRange[1] && priceRange[1] !== maxPrice) {
      params.append("price__lte", priceRange[1]);
    }

    // وزن - همیشه هر دو پارامتر اضافه می‌شوند
    params.append("weight__gte", weightRange[0]);
    params.append("weight__lte", weightRange[1]);

    // سایز - همیشه هر دو پارامتر اضافه می‌شوند
    params.append("size__gte", sizeRange[0]);
    params.append("size__lte", sizeRange[1]);

    if (Event.length > 0) {
      params.append("event_type__in", Event.join(","));
    }

    const queryString = params.toString();
    const newUrl = `${path}${queryString ? `?${queryString}` : ""}`;
    router.push(newUrl);
  }, [priceRange, weightRange, sizeRange, Event, product, path, router]);

  const handleCheckboxChange = useCallback((dataId, isChecked) => {
    if (isChecked) setEvent((prev) => [...prev, dataId]);
    else setEvent((prev) => prev.filter((id) => id !== dataId));
  }, []);

  if (!product?.data?.setting?.price || !isReady) {
    return <div className="filter-card">در حال بارگذاری...</div>;
  }

  const minPrice = Number(product.data.setting.price.min);
  const maxPrice = Number(product.data.setting.price.max);
  const currentMinPrice = priceRange[0] || minPrice;
  const currentMaxPrice = priceRange[1] || maxPrice;
  const currentMinWeight = weightRange[0] || MIN_WEIGHT;
  const currentMaxWeight = weightRange[1] || MAX_WEIGHT;
  const currentMinSize = sizeRange[0] || MIN_SIZE;
  const currentMaxSize = sizeRange[1] || MAX_SIZE;

  return (
    <>
      <style jsx>{`
        .accordion-collapse {
          visibility: visible !important;
          opacity: 1 !important;
        }
        .accordion-collapse.collapsing {
          transition: height 0.35s ease;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .accordion-collapse.show {
          visibility: visible !important;
          opacity: 1 !important;
        }
        .accordion-button.collapsed::after {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23880a0a'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e") !important;
        }
        .accordion-button:not(.collapsed)::after {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23880a0a'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e") !important;
          transform: rotate(-180deg) !important;
        }
        .accordion-button {
          background-color: transparent !important;
          color: #2c3e50 !important;
          font-weight: 600 !important;
          padding: 16px 0 !important;
          font-size: 16px !important;
        }
        .accordion-button:focus {
          box-shadow: none !important;
          border-color: transparent !important;
        }
        .filter-card-body {
          padding: 16px 0 !important;
        }
        .category-checkBox {
          margin-bottom: 12px;
        }
        .category-checkBox label {
          color: #5a6e7a;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .category-checkBox label:hover {
          color: #880a0a;
        }
        .form-check-input:checked {
          background-color: #880a0a;
          border-color: #880a0a;
        }
        .amount-input {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }
        .amount {
          background: #f8f9fa;
          padding: 8px 12px;
          border-radius: 8px;
          text-align: center;
          flex: 1;
        }
        .amount small {
          display: block;
          color: #999;
          font-size: 11px;
          margin-bottom: 4px;
        }
        .priceProduct,
        .weight-value,
        .size-value {
          font-size: 14px !important;
          font-weight: bold !important;
          color: #880a0a !important;
        }
        .rc-slider-track {
          background-color: #880a0a !important;
        }
        .rc-slider-handle {
          border-color: #880a0a !important;
          background-color: #880a0a !important;
        }
      `}</style>

      <div className="filter-card">
        <div className="card-title d-flex justify-content-between">
          <span>
            <h2 className="accordion-header">فیلتر</h2>
          </span>
          <a
            href="#"
            className="text-uppercase fw-normal fs-10px"
            onClick={handleReset}
          >
            <i className="bi bi-arrow-repeat me-1"></i> ریست
          </a>
        </div>

        <div className="accordion" id="accordionExample">
          {/* مناسبت ها */}
          <div className="filter-card-item">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseEvent"
              aria-expanded="true"
              aria-controls="collapseEvent"
            >
              مناسبت ها
            </button>
            <div
              id="collapseEvent"
              className="accordion-collapse collapse show"
              data-bs-parent="#accordionExample"
            >
              <div className="filter-card-body">
                <div className="search-group">
                  <input type="text" placeholder="جستجو مناسبت" />
                  <button>
                    <i className="bi bi-search"></i>
                  </button>
                </div>
                <div className="filter-card-scroll">
                  {product.data.setting.event?.map((data, index) => (
                    <div
                      key={data.id || index}
                      className="form-check category-checkBox"
                      style={{ fontSize: "15px", minHeight: "1.6rem" }}
                    >
                      <input
                        className="form-check-input"
                        onChange={(e) =>
                          handleCheckboxChange(data.id, e.target.checked)
                        }
                        checked={Event.includes(data.id)}
                        type="checkbox"
                        id={`categoryCheck${data.id || index}`}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`categoryCheck${data.id || index}`}
                      >
                        {data.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* محدوده قیمت */}
          <div className="filter-card-item border-0 m-0">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapsePrice"
              aria-expanded="false"
              aria-controls="collapsePrice"
            >
              محدوده قیمت (تومان)
            </button>
            <div
              id="collapsePrice"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="filter-card-body">
                <div className="slider-range-content">
                  <div className="amount-input">
                    <div className="amount">
                      <small>حداقل قیمت</small>
                      <NumberFormat
                        className="priceProduct"
                        displayType={"text"}
                        thousandSeparator={true}
                        value={Math.round(currentMinPrice / 10)}
                      />
                    </div>
                    <div className="amount">
                      <small>حداکثر قیمت</small>
                      <NumberFormat
                        className="priceProduct"
                        displayType={"text"}
                        thousandSeparator={true}
                        value={Math.round(currentMaxPrice / 10)}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "25px", padding: "0 8px" }}>
                    <Slider
                      range
                      min={minPrice}
                      max={maxPrice}
                      value={[currentMinPrice, currentMaxPrice]}
                      onChange={priceSliderChange}
                      railStyle={{ backgroundColor: "#dfdfdf", height: "6px" }}
                      trackStyle={{ backgroundColor: "#880a0a", height: "6px" }}
                      handleStyle={{
                        borderColor: "#880a0a",
                        backgroundColor: "#880a0a",
                        width: "16px",
                        height: "16px",
                        marginTop: "-5px",
                      }}
                      reverse={rtl}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* محدوده وزن */}
          <div className="filter-card-item border-0 m-0">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseWeight"
              aria-expanded="false"
              aria-controls="collapseWeight"
            >
              محدوده وزن (گرم)
            </button>
            <div
              id="collapseWeight"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="filter-card-body">
                <div className="slider-range-content">
                  <div className="amount-input">
                    <div className="amount">
                      <small>حداقل وزن</small>
                      <NumberFormat
                        className="weight-value"
                        displayType={"text"}
                        thousandSeparator={true}
                        value={currentMinWeight}
                        suffix=" گرم"
                      />
                    </div>
                    <div className="amount">
                      <small>حداکثر وزن</small>
                      <NumberFormat
                        className="weight-value"
                        displayType={"text"}
                        thousandSeparator={true}
                        value={currentMaxWeight}
                        suffix=" گرم"
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "25px", padding: "0 8px" }}>
                    <Slider
                      range
                      min={MIN_WEIGHT}
                      max={MAX_WEIGHT}
                      value={[currentMinWeight, currentMaxWeight]}
                      onChange={weightSliderChange}
                      railStyle={{ backgroundColor: "#dfdfdf", height: "6px" }}
                      trackStyle={{ backgroundColor: "#880a0a", height: "6px" }}
                      handleStyle={{
                        borderColor: "#880a0a",
                        backgroundColor: "#880a0a",
                        width: "16px",
                        height: "16px",
                        marginTop: "-5px",
                      }}
                      reverse={rtl}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* محدوده سایز */}
          <div className="filter-card-item border-0 m-0">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSize"
              aria-expanded="false"
              aria-controls="collapseSize"
            >
              محدوده سایز (میلی‌متر)
            </button>
            <div
              id="collapseSize"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="filter-card-body">
                <div className="slider-range-content">
                  <div className="amount-input">
                    <div className="amount">
                      <small>حداقل سایز</small>
                      <NumberFormat
                        className="size-value"
                        displayType={"text"}
                        thousandSeparator={true}
                        value={currentMinSize}
                        suffix=" میلی‌متر"
                      />
                    </div>
                    <div className="amount">
                      <small>حداکثر سایز</small>
                      <NumberFormat
                        className="size-value"
                        displayType={"text"}
                        thousandSeparator={true}
                        value={currentMaxSize}
                        suffix=" میلی‌متر"
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "25px", padding: "0 8px" }}>
                    <Slider
                      range
                      min={MIN_SIZE}
                      max={MAX_SIZE}
                      value={[currentMinSize, currentMaxSize]}
                      onChange={sizeSliderChange}
                      railStyle={{ backgroundColor: "#dfdfdf", height: "6px" }}
                      trackStyle={{ backgroundColor: "#880a0a", height: "6px" }}
                      handleStyle={{
                        borderColor: "#880a0a",
                        backgroundColor: "#880a0a",
                        width: "16px",
                        height: "16px",
                        marginTop: "-5px",
                      }}
                      reverse={rtl}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          style={{
            backgroundColor: "#F0F4F8",
            color: "#880a0a",
            borderRadius: 5,
            border: "1px solid #880a0a",
            marginTop: 40,
            width: "100%",
            padding: "10px 0",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onClick={handleSearch}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#880a0a";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#F0F4F8";
            e.currentTarget.style.color = "#880a0a";
          }}
        >
          جست و جو
        </button>
      </div>
    </>
  );
};

export default Filter;
