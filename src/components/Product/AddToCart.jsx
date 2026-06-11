import React from 'react'

const addToCart = ({ style, rtl }) => {
  return (
    <div className="qyt-addCart">
      <span className="me-4 mb-1 color-000 fw-bold fs-14px">{ rtl ? 'الكمية' : 'QTY' }</span>
      <div className="add-more">
        <span className="qt-minus"><i className="fas fa-minus"></i></span>
        <span className="qt">1</span>
        <span className="qt-plus"><i className="fas fa-plus"></i></span>
      </div>
      <a href="#" className={`btn rounded-pill bg-blue${style} fw-bold text-white`} target="_blank">
        <small> { rtl ? 'أضف إلى السلة' : 'Add To Cart' } </small>
      </a>
      <div className="fav-btn">
        <i className="fas fa-heart"></i>
      </div>
    </div>
  )
}

export default addToCart