import Link from "next/link";
import { useEffect, useState, useCallback } from "react"; // useCallback اضافه شد
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const HomeSlider = ({ slider = [] }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const filteredSlides = slider.filter((item) => item.mobile === isMobile);

  // تعریف پلاگین Autoplay
  const autoplayPlugin = useCallback(
    (slider) => {
      let timeout;
      let mouseOver = false;

      function clearNextTimeout() {
        clearTimeout(timeout);
      }

      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, 4000); // اینجا زمان 4 ثانیه تنظیم شده
      }

      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });
      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
    },
    [], // آرایه وابستگی خالی، چون این تابع نباید دوباره ساخته بشه
  );

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 0,
      },
      drag: true,
      mode: "snap",
      created(slider) {
        slider.update();
      },
    },
    // اینجا پلاگین Autoplay را پاس می‌دهیم
    [autoplayPlugin],
  );

  return (
    <section className="blog-slider pt-50 pb-50 style-1">
      <div className="blog-details-slider">
        <div ref={sliderRef} className="keen-slider">
          {filteredSlides.map((slide, index) => (
            <div className="keen-slider__slide" key={index}>
              <div className="content-card">
                <Link
                  href={slide.link && slide.link.length ? slide.link : "#"}
                  passHref
                >
                  <a className="content-card">
                    <div className="img-overlay">
                      <img
                        src={`https://python.krabo.gold${slide.image}`}
                        alt=""
                      />
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .blog-details-slider {
          width: 100%;
          overflow: hidden;
        }

        .keen-slider {
          width: 100%;
        }

        .keen-slider__slide {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .content-card {
          width: 100%;
          display: block;
        }

        .img-overlay {
          width: 100%;
          overflow: hidden;
        }

        .img-overlay img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }
      `}</style>
    </section>
  );
};

export default HomeSlider;
