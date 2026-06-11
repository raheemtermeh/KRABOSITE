const Product = ({ product }) => {
  return (
    <div className="col-6 col-lg-3 col-sm-6 card-width">
      <div className="product-card">
        <div className="img">
          <img
            src={"https://python.krabo.gold/media/Product/product/tetet.webp"}
            alt=""
          />
          {/* <img src={product.image} alt="" /> */}
          {/* { product.label && (<span className={`label ${product.label==='new'?'new':'sale-off'}`}>{ product.label }</span>) } */}
          <span className={`fav-btn ${product.liked ? "active" : ""}`}>
            {" "}
            <i className="fas fa-heart"></i>{" "}
          </span>
        </div>
        <div className="info">
          <h6 className="category">{product.category}</h6>
          <h5 className="title">{product.title}</h5>
          <div className="rate">
            <div className="stars">
              {/* {
                Array(5).fill(0).map((_, index) => (<i key={index} className={`fas fa-star ${index + 1 <= product.rating ? 'active':''}`}></i>))
              } */}
            </div>
            {/* <span className="rev ms-1">{ product.reviews } نظرات</span> */}
          </div>
        </div>
        <div className="price">
          10000
          {/* {
            typeof product.price === 'string' ? '$' + (product.price) : (
              <>
                <span className="price-sale">${ product.price.new }</span> <span className="old-price">${ product.price.old }</span>
              </>
            )
          } */}
        </div>

        <a href="#" className="btn rounded-pill mt-20">
          <span>{"مشاهده"}</span>
        </a>
      </div>
    </div>
  );
};

export default Product;
