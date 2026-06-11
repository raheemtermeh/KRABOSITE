
const ProductHead = ({ productName, rtl }) => {
  return (
    <div className="section-head text-center mb-80 style-5">
      <div className="page-links color-999">
        <a href="#" className="me-2">
          { rtl ? 'الرئيسية' : 'Home' }
        </a>
        <span className="me-2">/</span>
        <a href="#" className="me-2">
          { rtl ? 'متجر اى تيك' : 'Iteck’s Store' }
        </a>
        <span className="me-2">/</span>
        <a href="#" className="color-000">
          { productName }
        </a>
      </div>
    </div>
  )
}

export default ProductHead