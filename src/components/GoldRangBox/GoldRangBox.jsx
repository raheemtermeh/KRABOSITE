import { useState } from "react";
import { useRouter } from "next/router";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import axios from "axios";

const GoldRangBox = () => {
  const router = useRouter();
  const [range, setRange] = useState([1000000, 50000000]);


  const sliderChange = (value) => {
    setRange(value);
  };

  const applyFilter = () => {
            router.push(`/productCollection/?gender=&price__gte=${range[0]}&price__lte=${range[1]}`);
  };

  return (
    <div className="container" style={{ marginTop: "50px" }}>
      <div
        className="border rounded p-4"
        style={{ borderColor: "#880a0a", borderRadius: 10 }}
      >
        <h5 className="mb-3">چه رنج قیمتی میخواهید:</h5>

        <div className="mb-4">
          <Slider
            range
            min={1000000}
            max={50000000}
            defaultValue={[1000000, 50000000]}
            onChange={sliderChange}
            trackStyle={[{ backgroundColor: "#880a0a" }]}
            handleStyle={[
              { borderColor: "#880a0a", backgroundColor: "#fff" },
              { borderColor: "#880a0a", backgroundColor: "#fff" },
            ]}
          />
          <div className="d-flex justify-content-between mt-2">
            <span>بیشترین قیمت: {range[1]?.toLocaleString("de-DE")} تومان</span>
            <span>کمترین قیمت: {range[0]?.toLocaleString("de-DE")} تومان</span>
          </div>
        </div>

        <div className="text-center">
          <button className="btn custom-btn px-4 py-2" onClick={applyFilter}>
            مشاهده و خرید
          </button>
        </div>
      </div>
      <style jsx>{`
        .custom-btn {
          border-radius: 50px;
          background-color: #aaa;
          border: none;
          color: #fff;
        }

        .custom-btn:hover {
          background-color: #880a0a; /* رنگ در حالت هاور */
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default GoldRangBox;
