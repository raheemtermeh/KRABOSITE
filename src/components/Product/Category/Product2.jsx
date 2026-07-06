import NumberFormat from "react-number-format";
import { round } from "lodash";
import Link from "next/link";

const Product = ({ product }) => {
  // تابع برای جداسازی نام و کد محصول
  const formatProductName = (fullName) => {
    if (!fullName) return { name: "", code: "" };

    // حذف کلمه "کد" و خط جدید و فاصله‌های اضافی
    let cleanedName = fullName.replace(/کد\s*/g, "").trim();

    // الگوی تشخیص کدهای انگلیسی (مثل AS690, GOLD123, و...)
    const codePattern = /\b[A-Z]{2,3}\d{2,4}\b|\b\d{4,6}\b|\b[A-Z]+\d+\b/i;
    const match = cleanedName.match(codePattern);

    if (match) {
      const code = match[0];
      const name = cleanedName.replace(code, "").trim();
      return { name, code };
    }

    return { name: cleanedName, code: "" };
  };

  const { name, code } = formatProductName(product.name);

  return (
    <div className="col-6 col-lg-3 col-sm-6 card-width">
      <Link
        href={`/product/${product.main_category.slug}/${product.sub_category.slug}/${product.slug}`}
        className="block group"
      >
        <div className="bg-white rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl relative cursor-pointer">
          {/* بخش تصویر */}
          <div className="relative overflow-hidden bg-[#faf6f0]">
            <img
              src={`${product.image}`}
              alt={product.name}
              className="w-full aspect-square object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-95"
            />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
            </div>

            {product.label && (
              <span
                className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-medium tracking-wide shadow-sm ${
                  product.label === "new"
                    ? "bg-white/90 text-[#8B0000] border border-[#8B0000]/20"
                    : "bg-white/90 text-[#DAA520] border border-[#DAA520]/20"
                }`}
              >
                {product.label === "new" ? "جدید" : "ویژه"}
              </span>
            )}

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                <svg
                  className="w-5 h-5 text-[#8B0000]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* اطلاعات محصول */}
          <div className="p-4 text-center">
            {/* نام محصول */}
            <h3 className="text-sm md:text-base font-medium text-gray-700 mb-1 line-clamp-2 group-hover:text-[#8B0000] transition-colors duration-300">
              {name}
            </h3>

            {/* کد محصول با استایل خفن */}
            {code && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 group-hover:border-[#8B0000]/30 group-hover:from-white group-hover:to-[#8B0000]/5 transition-all duration-300 transform group-hover:scale-105 mt-1 mb-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-[#DAA520] transition-colors duration-300">
                  کد
                </span>
                <span className="w-3 h-px bg-gray-300 group-hover:w-4 group-hover:bg-[#DAA520] transition-all duration-300"></span>
                <span className="text-xs font-black text-gray-700 group-hover:text-[#8B0000] transition-all duration-300">
                  {code}
                </span>
              </div>
            )}

            {/* خط تزئینی */}
            <div className="w-8 h-px bg-gray-200 mx-auto my-2 group-hover:w-12 group-hover:bg-[#DAA520] transition-all duration-300"></div>

            {/* قیمت */}
            <div className="mt-2">
              <NumberFormat
                className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-[#8B0000] transition-colors duration-300"
                displayType={"text"}
                thousandSeparator={true}
                value={Math.round(product.properties / 10)}
              />
              <span className="text-xs font-medium text-gray-400 mr-1 group-hover:text-[#DAA520] transition-colors duration-300">
                تومان
              </span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B0000] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
      </Link>

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

export default Product;
