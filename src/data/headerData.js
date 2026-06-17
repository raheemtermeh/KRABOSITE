// src/data/headerData.js

// منوی پیش‌فرض و ثابت سایت کرابو
// این داده در تمام صفحات استفاده می‌شود و نیازی به درخواست شبکه ندارد
export const defaultHeader = {
  menu: [
    { title: "صفحه نخست", url: "/", menu_item: [] },
    { 
      title: "گردنبند", 
      url: "/product/necklaces", 
      menu_item: [] 
    },
    { 
      title: "گوشواره", 
      url: "/product/earrings", 
      menu_item: [] 
    },
    { 
      title: "دستبند", 
      url: "/product/bracelets", 
      menu_item: [] 
    },
    { 
      title: "انگشتر", 
      url: "/product/womens-gold-ring", 
      menu_item: [] 
    },
    { 
      title: "آویز", 
      url: "/product/watch-pendant", 
      menu_item: [] 
    },
  ],
};

export default defaultHeader;