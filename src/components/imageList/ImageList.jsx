import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper"; // Import Navigation module
import { useEffect } from "react";
import { useRouter } from "next/router";

const ImageList = () => {
  const router = useRouter();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
            .collection-item {
                position: relative; /* Enable positioning for child elements */
                display: flex; /* Use flexbox to center content */
                justify-content: center; /* Center horizontally */
                align-items: center; /* Center vertically */
                text-align: center;
                cursor: pointer;
                overflow: hidden; /* Ensure overflow is hidden */
                transition: transform 0.3s;
            }
            .collection-item:hover {
                transform: scale(1.05);
            }
            .collection-image {
                width: 100%; /* Full width of the item */
                height: 400px; /* Fixed height */
                object-fit: cover; /* Ensures images are cropped and fit */
                border-radius: 8px;
                transition: opacity 0.3s; /* Smooth transition */
            }
            .collection-text {
                position: absolute; /* Position text absolutely */
                bottom: 10px; /* Adjust as needed */
                right: 10px; /* Adjust as needed */
                color: white; /* Change text color */
                background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
                padding: 5px; /* Padding around the text */
                border-radius: 5px; /* Rounded corners */
                font-weight: bold; /* Bold text */
                transition: opacity 0.3s; /* Smooth transition for text */
            }
            .collection-item:hover .collection-image {
                opacity: 0.7; /* Dim image on hover */
            }
            .collection-item:hover .collection-text {
                opacity: 1; /* Ensure text is fully visible on hover */
            }

            /* Custom styles for Swiper navigation buttons */
            .swiper-button-next,
            .swiper-button-prev {
                background: none !important; /* Remove background */
                color: #999 !important; /* Set button color */
                width: 30px; /* Adjust button width */
                height: 30px; /* Adjust button height */
                display: flex; /* Center the arrow */
                align-items: center; /* Center vertically */
                justify-content: center; /* Center horizontally */
                opacity: 1 !important; /* Ensure buttons are visible */
            }

            .swiper-button-next::after,
            .swiper-button-prev::after {
                font-size: 18px; /* Adjust icon size */
                color: #999 !important; /* Ensure icon color */
            }
        `;
    document.head.appendChild(style);

 
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="container" style={{ marginTop: "50px" }}>
      <Swiper
        modules={[Navigation]} 
        spaceBetween={20} 
        slidesPerView={1} 
        navigation 
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 4,
          },
        }}
      >
        <SwiperSlide>
          <img
            className="collection-image"
            src="/assets/img/neckless.PNG"
            alt="کالکشن زنانه"
          />
        </SwiperSlide>
        <SwiperSlide
          onClick={() => {
            router.push(`/productCollection/?gender=woman`);
          }}
        >
        <div style={{textAlign:"center"}}> 
          <img
            style={{
              width: "100%",
              height: "100%", 
              objectFit: "cover",
            }}
            className="collection-image"
            src="/assets/img/logo.PNG"
            alt="گولو"
          />
          <h4 style={{color:"#9f6c2a",marginTop:30,fontWeight:"lighter"}}>خرید و سفارش</h4>
          <h3 style={{color:"#9f6c2a"}}> آنلاین طلا</h3>
          </div>
        </SwiperSlide>
        <SwiperSlide
          onClick={() => {
            router.push(`/productCollection/?gender=man`);
          }}
        >
          <img
            className="collection-image"
            src="/assets/img/earing.PNG"
            alt="کالکشن مردانه"
          />
        </SwiperSlide>
        <SwiperSlide
          onClick={() => {
            router.push(`/productCollection/?gender=child`);
          }}
        >
          <img
            className="collection-image"
            src="/assets/img/bracelet.PNG"
            alt="کالکشن بچگانه"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ImageList;
