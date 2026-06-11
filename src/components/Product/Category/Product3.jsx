import Link from "next/link";

const Product3 = ({ product, rtl }) => {
  return (
    <div className="group h-full">
      <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-sm h-full flex flex-col relative">
        {/* خط بالایی */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8B0000] via-[#DAA520] to-[#8B0000] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

        {/* بخش تصویر */}
        <Link
          href={`/product/${product.main?.slug}/${product?.slug}/`}
          passHref
        >
          <a className="block relative overflow-hidden bg-amber-50">
            <div className="relative overflow-hidden">
              <img
                src={`https://python.krabo.gold${product.image}`}
                alt={product.title_seo}
                className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* اوورلای */}
              <div className="absolute inset-0 bg-[#8B0000]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                <span className="text-white text-sm font-semibold px-4 py-2 border-2 border-[#DAA520] rounded-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  مشاهده محصول
                </span>
              </div>

              {/* برچسب */}
              {product.label && (
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-md ${
                    product.label === "new"
                      ? "bg-[#8B0000] text-white border border-[#DAA520]/50"
                      : "bg-[#DAA520] text-[#8B0000] border border-[#8B0000]/30"
                  }`}
                >
                  {product.label === "new" ? "جدید" : "ویژه"}
                </span>
              )}
            </div>
          </a>
        </Link>

        {/* اطلاعات */}
        <div className="p-4 text-center flex-1 flex flex-col">
          <Link
            href={`/product/${product.main?.slug}/${product?.slug}/`}
            passHref
          >
            <a>
              <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2 line-clamp-2 hover:text-[#8B0000] transition-colors">
                {product.name}
              </h3>
            </a>
          </Link>

          {/* ستاره‌ها */}
          {/* <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="fas fa-star text-[11px] text-[#DAA520]"></i>
            ))}
          </div> */}

          {/* قیمت */}
          {/* <div className="mb-4 mt-auto">
            <Link
              href={`/product/${product.main?.slug}/${product?.slug}/`}
              passHref
            >
              <a>
                <span className="text-lg md:text-xl font-extrabold text-[#8B0000]">
                  {product.properties?.toLocaleString("fa-IR")}
                </span>
                <span className="text-sm font-medium text-[#DAA520] mr-1">
                  تومان
                </span>
              </a>
            </Link>
          </div> */}

          {/* دکمه */}
          <Link
            href={`/product/${product.main?.slug}/${product?.slug}/`}
            passHref
          >
            <a className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-transparent border-2 border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white rounded-full font-semibold text-sm transition-all duration-300 group/btn">
              <span>بیشتر...</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </a>
          </Link>
        </div>

        {/* الماس‌های گوشه */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#DAA520] rotate-45 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#DAA520] rotate-45 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#DAA520] rotate-45 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#DAA520] rotate-45 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200"></div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Product3;
