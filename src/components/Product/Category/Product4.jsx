import NumberFormat from "react-number-format";
import { round } from "lodash";
import Link from "next/link";

const Product = ({ product, rtl }) => {
  ({ product });

  return (
    <div className="col-6 col-lg-3 col-sm-6 card-width">
      <div className="product-card">
        <Link
          href={
            {
              // pathname: `/product/${product.main_category.slug}/${product.sub_category.slug}/${product.slug}`,
            }
          }
          passHref
        >
          <a className="">
            <div className="img">
              <img src={`https://python.krabo.gold${product.image}`} alt="" />
              {product.label && (
                <span
                  className={`label ${product.label === "new" ? "new" : "sale-off"}`}
                >
                  {product.label}
                </span>
              )}
              <span className={`fav-btn ${product.liked ? "active" : ""}`}>
                {" "}
                <i className="fas fa-heart"></i>{" "}
              </span>
            </div>
          </a>
        </Link>

        <div className="info">
          {/* <h6 className="category">{ product.category }</h6> */}
          <h3 className="title">{product.name}</h3>
          <div className="rate" style={{ textAlign: "center" }}>
            <div className="stars">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <i
                    key={index}
                    className={`fas fa-star ${index + 1 <= 5 ? "active" : ""}`}
                  ></i>
                ))}
            </div>
            {/* <span className="rev ms-1">{ product.reviews }</span> */}
          </div>
        </div>
        <div className="price" style={{ textAlign: "center" }}>
          <Link
            href={
              {
                // pathname: `/product/${product.main_category.slug}/${product.sub_category.slug}/${product.slug}`,
              }
            }
            passHref
          >
            <a className="">
              <span>{product.properties?.toLocaleString("de-DE")}</span>
            </a>
          </Link>

          {/* <NumberFormat className='priceProduct' style={{
                  fontWeight :'bold', fontSize: '29px',  color: 'black' }} 
               displayType={'text'} 
              thousandSeparator={true} prefix={'تومان'} 
              value={ round(product.price,2) }
            
            /> */}
        </div>
        <Link
          href={
            {
              // pathname: `/product/${product.main_category.slug}/${product.sub_category.slug}/${product.slug}`,
            }
          }
          passHref
        >
          <a className="btn rounded-pill mt-20">
            <span>مشاهده</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Product;
