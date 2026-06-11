import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Mousewheel, Keyboard } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";
import Link from "next/link";
import NumberFormat from "react-number-format";
import { round } from "lodash";

SwiperCore.use([Autoplay, Navigation, Mousewheel, Keyboard]);

const Projects = ({ suggested, title }) => {
  const [load, setLoad] = useState(true);
  const [Filter, SetFilter] = useState(null);
  const [IdImage, SetIdImage] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8">
            محصولات{" "}
            <span className="text-[#880a0a] relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-full after:h-1 after:bg-[#880a0a] after:opacity-30">
              کرابو
            </span>
          </h2>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-5xl mx-auto mb-8">
            {suggested.category.map((category, index) => (
              <button
                key={index}
                onClick={() => {
                  if (category.id === 0) {
                    SetFilter(null);
                  } else {
                    SetFilter(category.id);
                  }
                }}
                className={`
                  px-6 py-3 rounded-full font-medium text-sm md:text-base
                  transition-all duration-300 transform hover:scale-105
                  ${
                    (index === 0 && Filter === null) || Filter === category.id
                      ? "bg-[#880a0a] text-white shadow-lg shadow-[#880a0a]/30"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid/Swiper */}
        <div className="max-w-7xl mx-auto">
          {load && (
            <Swiper
              spaceBetween={24}
              speed={1000}
              pagination={false}
              navigation={{
                nextEl: ".projects.style-7 .swiper-button-next",
                prevEl: ".projects.style-7 .swiper-button-prev",
              }}
              mousewheel={false}
              keyboard={true}
              observer={true}
              observeParents={true}
              loop={false}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                480: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              className="!pb-4"
            >
              {suggested.product
                .filter((row) =>
                  Filter ? row.main_category.id === Filter : true,
                )
                .map((product, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                      onMouseMove={() => SetIdImage(index)}
                      onMouseLeave={() => SetIdImage(null)}
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden bg-gray-100 aspect-square">
                        <Link
                          href={{
                            pathname: `/product/${product.main_category.slug}/${product.sub_category.slug}/${product.slug}`,
                          }}
                          passHref
                        >
                          <a className="block w-full h-full">
                            <img
                              src={`${
                                index === IdImage && product.gallery.length > 0
                                  ? `https://python.krabo.gold/media/${
                                      product.gallery[0]?.image
                                    }`
                                  : `https://python.krabo.gold/${product.image}`
                              }`}
                              alt={product?.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </a>
                        </Link>

                        {/* Labels */}
                        {product?.label && (
                          <span
                            className={`
                            absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white
                            ${
                              product?.label === "new"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          `}
                          >
                            {product?.label}
                          </span>
                        )}

                        {/* Favorite Button */}
                        <button
                          className={`
                          absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center
                          transition-all duration-300 backdrop-blur-sm
                          ${
                            product?.liked
                              ? "bg-red-500 text-white"
                              : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
                          }
                        `}
                        >
                          <i className="fas fa-heart text-sm"></i>
                        </button>

                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        {/* Title */}
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 min-h-[3rem] line-clamp-2 hover:text-[#880a0a] transition-colors">
                          <Link
                            href={{
                              pathname: `/product/${product.main_category.slug}/${product.sub_category.slug}/${product.slug}`,
                            }}
                          >
                            {product?.name}
                          </Link>
                        </h3>

                        {/* Rating */}
                        <div className="flex justify-center gap-1 mb-4">
                          {Array(5)
                            .fill(0)
                            .map((_, starIndex) => (
                              <i
                                key={starIndex}
                                className={`fas fa-star text-sm ${
                                  starIndex + 1 <= 5
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              ></i>
                            ))}
                        </div>

                        {/* Price */}
                        <div className="text-center mb-4">
                          <Link
                            href={{
                              pathname: `/product/${product.main_category.slug}/${product.sub_category.slug}/${product.slug}`,
                            }}
                            passHref
                          >
                            <a className="text-xl md:text-2xl font-bold text-[#880a0a]">
                              <NumberFormat
                                displayType={"text"}
                                thousandSeparator={true}
                                suffix={" تومان"}
                                value={round(product?.properties / 10, 0)}
                              />
                            </a>
                          </Link>
                        </div>

                        {/* CTA Button */}
                        <Link
                          href={{
                            pathname: `/product/${product.main_category.slug}/${product.sub_category.slug}/${product.slug}`,
                          }}
                          passHref
                        >
                          <a className="block w-full py-3 text-center rounded-xl font-medium bg-gradient-to-r from-[#880a0a] to-[#a01212] text-white hover:from-[#a01212] hover:to-[#880a0a] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                            مشاهده محصول
                          </a>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
