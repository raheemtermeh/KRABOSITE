
const MoreInfo = ({ moreInfo, rtl }) => {
  return (
    <div className="more-info pt-20 mt-1 border-1 border-top brd-gray">
      <p className="text-uppercase fs-14px color-666 mb-1"> <strong className="color-000">{ rtl ? 'الموديل' : 'SKU' }:</strong> { moreInfo.SKU }</p>
      <p className="fs-14px color-666 mb-1"><strong className="color-000">{ rtl ? 'التصنيف' : 'Category' }:</strong> { moreInfo.category }</p>
      <p className="fs-14px color-666 mb-1">
        <strong className="color-000">{ rtl ? 'الكلمات الدلالية' : 'Tags' }:</strong> { moreInfo.tags.map((tag, index) => (<a href="#" className="me-1" key={index}>{ tag }, </a>)) }
      </p>
    </div>
  )
}

export default MoreInfo