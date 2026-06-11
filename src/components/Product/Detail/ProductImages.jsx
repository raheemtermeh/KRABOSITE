import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { FreeMode, Thumbs } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

SwiperCore.use([FreeMode, Thumbs]);

const ProductImages = ({}) => {
  const [galleryThumbs, setGalleryThumbs] = useState(null);

  return (
    <div className="col-lg-6">
      <div className="product-slider">
        <Swiper
          className="swiper-container gallery-thumbs"
          spaceBetween={20}
          slidesPerView={6}
          freeMode={true}
          watchSlidesProgress={true}
          direction="vertical"
          onInit={(swiper) => {
            setGalleryThumbs(swiper);
          }}
        >
          {/* {
            productImages.map((image, index) => ( */}
          <SwiperSlide key={1}>
            <div className="img">
              <img
                src={
                  "https://python.krabo.gold/media/Product/product/%D8%B4%D8%B3%DB%8C%D8%B3%D8%B4%DB%8C%D8%B3%D8%B4%DB%8C.jpg"
                }
                alt=""
              />
            </div>
          </SwiperSlide>

          <SwiperSlide key={2}>
            <div className="img">
              <img
                src={
                  "https://python.krabo.gold/media/Product/product/asdad.webp"
                }
                alt=""
              />
            </div>
          </SwiperSlide>
          {/* ))
          } */}
        </Swiper>
        {galleryThumbs && (
          <Swiper
            className="swiper-container gallery-top"
            spaceBetween={10}
            navigation={false}
            thumbs={{
              swiper: galleryThumbs,
            }}
          >
            {/* {
                productImages.map((image, index) => ( */}
            <SwiperSlide key={1}>
              <div className="img">
                <img
                  src={
                    "https://python.krabo.gold/media/Product/product/%D8%B4%D8%B3%DB%8C%D8%B3%D8%B4%DB%8C%D8%B3%D8%B4%DB%8C.jpg"
                  }
                  alt=""
                />
              </div>
            </SwiperSlide>

            <SwiperSlide key={2}>
              <div className="img">
                <img
                  src={
                    "https://python.krabo.gold/media/Product/product/asdad.webp"
                  }
                  alt=""
                />
              </div>
            </SwiperSlide>
            {/* ))
              } */}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default ProductImages;
