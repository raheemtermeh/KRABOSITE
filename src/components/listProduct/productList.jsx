import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  GiDiamondRing,
  GiNecklace,
  GiBracers,
  GiEarrings,
  GiGemPendant,
  GiGoldBar,
  GiBracelet,
  GiCrystalEarrings,
} from "react-icons/gi";

// آیکون‌های پیش‌فرض برای دسته‌بندی‌های مختلف
const categoryIcons = {
  گردنبند: <GiNecklace />,
  گوشواره: <GiEarrings />,
  انگشتر: <GiDiamondRing />,
  دستبند: <GiBracers />,
  آویز: <GiGemPendant />,
  سکه: <GiGoldBar />,
  "دستبند طلا": <GiBracelet />,
  "گوشواره طلا": <GiCrystalEarrings />,
};

const ProductList = ({ header }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // استخراج دسته‌بندی‌های اصلی از هدر
    if (header?.menu) {
      const productCategories = [];

      header.menu.forEach((item) => {
        // بررسی آیتم‌هایی که URL معتبر دارند و مربوط به محصولات هستند
        if (
          item.url &&
          item.url !== "." &&
          item.url !== "" &&
          (item.url.includes("/product/") || item.url.includes("/category/"))
        ) {
          // ساخت slug از URL
          const urlParts = item.url.split("/").filter(Boolean);
          const slug = urlParts[urlParts.length - 1];

          productCategories.push({
            id: item.id,
            name: item.title,
            href: item.url,
            slug: slug,
            isMainCategory: true,
          });
        }

        // همچنین بررسی آیتم‌های منوی زنانه که دسته‌بندی‌های اصلی را دارند
        if (
          item.menu_item &&
          item.menu_item.length > 0 &&
          item.title === "زنانه"
        ) {
          item.menu_item.forEach((subItem) => {
            // اینها دسته‌بندی‌های اصلی هستند (گردنبند، انگشتر، گوشواره، etc)
            const categorySlug = getCategorySlug(subItem.title);
            if (categorySlug) {
              productCategories.push({
                id: subItem.id,
                name: subItem.title,
                href: `/product/${categorySlug}/`,
                slug: categorySlug,
                isMainCategory: true,
              });
            }
          });
        }
      });

      // حذف تکراری‌ها بر اساس نام
      const uniqueCategories = Array.from(
        new Map(productCategories.map((cat) => [cat.name, cat])).values(),
      );

      // مرتب‌سازی دسته‌بندی‌ها
      const sortedCategories = uniqueCategories.sort((a, b) => {
        const order = [
          "گردنبند",
          "انگشتر",
          "گوشواره",
          "دستبند",
          "آویز",
          "پلاک اسم",
          "النگو",
          "ست و نیم ست",
        ];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });

      console.log("Final categories:", sortedCategories);
      setCategories(sortedCategories);
    }
  }, [header]);

  // تابع کمکی برای تبدیل نام دسته‌بندی به slug
  const getCategorySlug = (categoryName) => {
    const slugMap = {
      گردنبند: "necklaces",
      انگشتر: "womens-gold-ring",
      گوشواره: "earrings",
      دستبند: "bracelets",
      آویز: "watch-pendant",
      "پلاک اسم": "nameplate",
      النگو: "bangle",
      "ست و نیم ست": "set-and-half-set-of-women-'s-gold",
    };
    return slugMap[categoryName] || null;
  };

  // تابع کمکی برای گرفتن آیکون مناسب
  const getIcon = (categoryName) => {
    return categoryIcons[categoryName] || <GiGemPendant />;
  };

  // اگر دسته‌بندی نداشتیم، از داده‌های پیش‌فرض استفاده کنیم
  const displayCategories =
    categories.length > 0
      ? categories
      : [
          { name: "گردنبند", href: "/product/necklaces/", slug: "necklaces" },
          { name: "گوشواره", href: "/product/earrings/", slug: "earrings" },
          {
            name: "انگشتر",
            href: "/product/womens-gold-ring/",
            slug: "womens-gold-ring",
          },
          { name: "دستبند", href: "/product/bracelets/", slug: "bracelets" },
          {
            name: "آویز",
            href: "/product/watch-pendant/",
            slug: "watch-pendant",
          },
        ];

  const handleCategoryClick = (href, name) => {
    console.log(`Navigating to: ${href} for category: ${name}`);
    router.push(href);
  };

  return (
    <div className="w-full pt-60 px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
      <div className="relative">
        {/* Title with animation */}
        <h3 className="text-gray-800 text-center text-xl sm:text-2xl font-bold mb-6 sm:mb-8 relative inline-block w-full">
          <span className="relative z-10 px-4">دسته‌بندی محصولات</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-[#880a0a] to-[#ff8c00] rounded-full"></span>
        </h3>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {displayCategories.map((item, index) => (
            <div
              key={item.name}
              className="group relative cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleCategoryClick(item.href, item.name)}
            >
              {/* Container for both arches */}
              <div className="relative w-full aspect-[3/4] flex flex-col items-center justify-center">
                {/* Top Arch */}
                <div
                  className={`relative w-[85%] h-[50%] transition-all duration-500 cursor-pointer overflow-hidden ${
                    hoveredIndex === index
                      ? "scale-[0.97] shadow-2xl"
                      : "scale-100 shadow-md"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, #c4c7a8 0%, #a8ab8a 100%)",
                    borderRadius: "80px 80px 1px 1px",
                  }}
                >
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none"
                    style={{ borderRadius: "20px 20px 8px 8px" }}
                  ></div>

                  {/* Shimmer Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-opacity duration-700 ${
                      hoveredIndex === index
                        ? "opacity-100 animate-shimmer"
                        : "opacity-0"
                    }`}
                    style={{ borderRadius: "20px 20px 8px 8px" }}
                  ></div>

                  {/* Text in Top Arch */}
                  <div className="absolute inset-0 flex items-center justify-center px-3 overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* متن - در حالت عادی */}
                      <div
                        className={`absolute transition-all duration-500 ${
                          hoveredIndex === index
                            ? "opacity-0 translate-y-full"
                            : "opacity-100 translate-y-0"
                        }`}
                      >
                        <h6 className="text-[#5d0504] font-bold text-sm sm:text-base lg:text-lg text-center">
                          {item.name}
                        </h6>
                      </div>

                      {/* آیکون - در حالت هاور */}
                      <div
                        className={`absolute transition-all duration-500 ${
                          hoveredIndex === index
                            ? "opacity-100 translate-y-0 scale-110"
                            : "opacity-0 -translate-y-full scale-0"
                        }`}
                      >
                        <div className="text-2xl sm:text-3xl lg:text-4xl text-[#5d0504]">
                          {getIcon(item.name)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inner Border */}
                  <div
                    className={`absolute inset-1.5 border-2 border-white/10 transition-opacity duration-500 ${
                      hoveredIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ borderRadius: "16px 16px 6px 6px" }}
                  ></div>
                </div>

                {/* Middle Gap with Decorative Line */}
                <div className="relative w-full h-[1%] flex items-center justify-center">
                  <div
                    className={`w-[60%] h-0.5 bg-gradient-to-r from-transparent via-gray-400/40 to-transparent transition-all duration-500 ${
                      hoveredIndex === index
                        ? "opacity-100 scale-x-110"
                        : "opacity-60 scale-x-100"
                    }`}
                  ></div>
                  {/* Center Dot */}
                  <div
                    className={`absolute w-2 h-2 rounded-full bg-gray-400/60 transition-all duration-500 ${
                      hoveredIndex === index
                        ? "scale-150 bg-white/80"
                        : "scale-100"
                    }`}
                  ></div>
                </div>

                {/* Bottom Arch */}
                <div
                  className={`relative w-[85%] h-[50%] transition-all duration-500 cursor-pointer overflow-hidden ${
                    hoveredIndex === index
                      ? "scale-[0.97] shadow-2xl"
                      : "scale-100 shadow-md"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, #a8ab8a 0%, #c4c7a8 100%)",
                    borderRadius: "1px 1px 60px 60px",
                  }}
                >
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-tl from-white/10 via-transparent to-black/5 pointer-events-none"
                    style={{ borderRadius: "8px 8px 20px 20px" }}
                  ></div>

                  {/* Shimmer Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-opacity duration-700 ${
                      hoveredIndex === index
                        ? "opacity-100 animate-shimmer-reverse"
                        : "opacity-0"
                    }`}
                    style={{ borderRadius: "8px 8px 20px 20px" }}
                  ></div>

                  {/* Icon/Text in Bottom Arch */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* آیکون - در حالت عادی */}
                      <div
                        className={`absolute transition-all duration-500 ${
                          hoveredIndex === index
                            ? "opacity-0 translate-y-full"
                            : "opacity-100 translate-y-0"
                        }`}
                      >
                        <div className="text-3xl sm:text-4xl lg:text-5xl text-white/90">
                          {getIcon(item.name)}
                        </div>
                      </div>

                      {/* متن - در حالت هاور */}
                      <div
                        className={`absolute transition-all duration-500 ${
                          hoveredIndex === index
                            ? "opacity-100 translate-y-0 scale-110"
                            : "opacity-0 -translate-y-full scale-0"
                        }`}
                      >
                        <h6 className="text-white font-bold text-sm sm:text-base lg:text-lg text-center">
                          {item.name}
                        </h6>
                      </div>
                    </div>
                  </div>

                  {/* Inner Border */}
                  <div
                    className={`absolute inset-1.5 border-2 border-white/10 transition-opacity duration-500 ${
                      hoveredIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ borderRadius: "6px 6px 16px 16px" }}
                  ></div>
                </div>
              </div>

              {/* Bottom Soft Shadow */}
              <div
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-3 bg-gray-400/30 blur-xl rounded-full transition-all duration-500 ${
                  hoveredIndex === index
                    ? "opacity-60 scale-110"
                    : "opacity-30 scale-100"
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        @keyframes shimmer-reverse {
          0% {
            transform: translateX(200%) skewX(15deg);
          }
          100% {
            transform: translateX(-100%) skewX(15deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 0.8s ease-in-out;
        }

        .animate-shimmer-reverse {
          animation: shimmer-reverse 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ProductList;
