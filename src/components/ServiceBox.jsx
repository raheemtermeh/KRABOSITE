import React from "react";
import Image from "next/image";
import FreeSendImg from "../../public/assets/img/hnd.svg";
import sup from "../../public/assets/img/sup.svg";
import pay from "../../public/assets/img/pay.svg";

const ServiceBox = () => {
  const services = [
    {
      id: 1,
      title: "پرداخت اقساط",
      image: pay.src,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: 2,
      title: "خرید حضوری",
      image: sup.src,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 3,
      title: "پشتیبانی ۲۴ ساعته",
      image: FreeSendImg.src,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: 4,
      title: "ارسال رایگان",
      image: FreeSendImg.src,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="w-full py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-1">
          {services.map((service, index) => {
            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl hover:shadow-2xl transition-all duration-500 p-8 text-center cursor-pointer overflow-hidden"
                style={{
                  width: "180px",
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                
                {/* دایره پشت عکس */}
                <div
                  className={`relative w-28 h-28 mx-auto mb-1 rounded-full  flex items-center justify-center transition-all duration-500 group-hover:scale-110 `}
                >

                  {/* عکس اصلی */}
                  <div className="relative w-14 h-14 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* عنوان */}
                <h3 className="text-lg font-bold text-gray-800 mb-1 transition-all duration-300 group-hover:text-gray-900">
                  {service.title}
                </h3>

                {/* خط زیرین متحرک */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-300 group-hover:w-1/2"
                  style={{
                    color: service.color.split(" ")[1]?.replace("from-", ""),
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .group {
          animation: float 4s ease-in-out infinite;
        }

        .group:nth-child(1) {
          animation-delay: 0s;
        }
        .group:nth-child(2) {
          animation-delay: 0.5s;
        }
        .group:nth-child(3) {
          animation-delay: 1s;
        }
        .group:nth-child(4) {
          animation-delay: 1.5s;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        /* ریسپانسیو برای موبایل */
        @media (max-width: 768px) {
          .group {
            width: calc(50% - 1rem) !important;
          }
        }

        @media (max-width: 480px) {
          .group {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceBox;
