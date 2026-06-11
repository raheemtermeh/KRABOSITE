
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper"; // Import Navigation module
import { useEffect } from "react";
import { useRouter } from "next/router";



const CollectionList = () => {
    const router=useRouter()


    useEffect(() => {
        const style = document.createElement('style');
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

        // Cleanup on component unmount
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="container" style={{marginTop:"50px",marginBottom:"50px"}}>
            <Swiper
                modules={[Navigation]} // Use the Navigation module
                spaceBetween={20} // Space between slides
                slidesPerView={1} // Default to 1 slide on mobile
                navigation // Enable navigation buttons
                breakpoints={{
                    640: {
                        slidesPerView: 2, // 2 slides on small screens
                    },
                    768: {
                        slidesPerView: 3, // 3 slides on medium screens
                    },
                }}
                className="mySwiper"
            >
                    <SwiperSlide onClick={()=>{ router.push(`/productCollection/?gender=woman`)}} >
                        <div className="collection-item">
                            <img className="collection-image" src="/assets/img/women.webp" alt="کالکشن زنانه"/>
                            <h6 className="collection-text">کالکشن زنانه</h6>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide onClick={()=>{ router.push(`/productCollection/?gender=man`)}} >
                        <div className="collection-item">
                            <img className="collection-image" src="/assets/img/men.webp" alt="کالکشن مردانه" />
                            <h6 className="collection-text">کالکشن مردانه</h6>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide onClick={()=>{ router.push(`/productCollection/?gender=child`)}} >
                        <div className="collection-item">
                            <img className="collection-image" src="/assets/img/children2.webp" alt="کالکشن بچگانه" />
                            <h6 className="collection-text">کالکشن بچگانه</h6>
                        </div>
                    </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default CollectionList;
