import React from 'react'

const MainInfo = ({ mainInfo, rtl }) => {
  return (
    <>
      <h6 className="category">{ mainInfo.category }</h6>
      <h5 className="title">{ mainInfo.title }</h5>
      <div className="rate">
        <div className="stars">
          {
            Array(5).fill(0).map((_, index) => (<i key={index} className={`fas fa-star ${index + 1 <= mainInfo.rating ? 'active':''}`}></i>))
          }
        </div>
        <span className="rev ms-1">{ mainInfo.reviews } { rtl ? 'المراجعات' : 'Reviews' }</span>
      </div>
      <div className="price">
        ${ mainInfo.price }
      </div>
      <div className="info-text">
        { mainInfo.discription }
      </div>
      <ul className="info-list">
        { 
          mainInfo.features.map((feature, i) => (
            <li className="d-flex align-items-center" key={i}>
              <i className="bi bi-dash me-1"></i>
              { feature }
            </li>
          )) 
        }
      </ul>
    </>
  )
}

export default MainInfo