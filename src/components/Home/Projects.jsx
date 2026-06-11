import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import projectsData from "@data/Freelancer/projects.json";
import Link from "next/link";
import "swiper/css";
import "swiper/css/autoplay";
import { useRouter } from "next/router";
import NumberFormat from "react-number-format";
import { round } from "lodash";

SwiperCore.use([Autoplay]);

const Projects = ({ banner, boxNumber }) => {
  const [loadSwiper, setLoadSwiper] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoadSwiper(true);
    }, 0);
  }, []);

  return (
    <div className="container">
      <div className="section-head text-center mb-40">
        {/* <h6 style={{ color: "#fff" }}>کرابو</h6> */}
        <h2 style={{ marginTop: "100px" }}>{banner?.[0]?.name}</h2>
      </div>
      <div className="tab-content" id="pills-tabContent">
        {projectsData.tabContent?.map((tab, idx) => (
          <div
            className={`tab-pane fade ${idx === 0 ? "show active" : ""}`}
            id={`pills-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`pills-${tab.id}-tab`}
            key={idx}
          >
            <div className="projects-slider">
              {loadSwiper && (
                <Swiper
                  className="swiper-container"
                  spaceBetween={30}
                  observer={true}
                  observeParents={true}
                  speed={1000}
                  autoplay={{ delay: 5000 }}
                  loop={true}
                  pagination={false}
                  navigation={false}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    480: { slidesPerView: 1 },
                    787: { slidesPerView: 2 },
                    991: { slidesPerView: 2 },
                    1200: { slidesPerView: boxNumber },
                  }}
                >
                  {(banner?.[0]?.img?.length > 0
                    ? banner?.[0]?.img
                    : banner?.[0]?.product
                  )?.map((banner, index) => (
                    // banner?.[0] && banner?.[0].img
                    <SwiperSlide key={index}>
                      <div
                        className="project-card"
                        style={{
                          // backgroundColor: "#880A0A",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <Link
                          href={
                            banner.href && banner.href.length > 0
                              ? banner.href
                              : `product/${banner.main_category.slug}/${banner.sub_category.slug}/${banner.slug}`
                          }
                          passHref
                        >
                          <a className="img img-cover">
                            <img
                              src={`https://python.krabo.gold/${banner.image}`}
                              alt={banner?.name}
                              style={{ width: "100%", height: "auto" }}
                            />
                            <div className="info">
                              <div className="row align-items-center">
                                <div className="col-12 text-center">
                                  <h6 style={{ color: "#222" }}>
                                    {banner?.name}
                                  </h6>
                                  <h6 style={{ color: "#222" }}>
                                    <NumberFormat
                                      className="priceProduct"
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                        color: "black",
                                      }}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                      prefix={"تومان"}
                                      value={round(banner?.properties / 10, 0)}
                                    />
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
              {/* <div className="text-center mt-50">
                <a
                  href="#0"
                  className="btn rounded-pill text-dark bg-white border-1 brd-gray shadow-lg hover-orange3"
                  target="_blank"
                >
                  <small>
                    بیشتر <i className="fal fa-plus ms-2"></i>
                  </small>
                </a>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
