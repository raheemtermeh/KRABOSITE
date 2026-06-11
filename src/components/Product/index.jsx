import ProductHead from './ProductHead'
import ProductImages from './ProductImages'
import MainInfo from './MainInfo'
import ColorSelect from './ColorSelect'
import AddToCart from './AddToCart'
import MoreInfo from './MoreInfo'
import SocialIcons from './SocialIcons'

import productData from '@data/App/product.json';
import productDataRTL from '@data/App/product-rtl.json';

const Product = ({ style = "4", rtl }) => {
  const data = rtl ? productDataRTL : productData;

  return (
    <section className="product pt-50">
      <div className="container">
        <ProductHead productName={data.title} rtl={rtl} />
        <div className="content">
          <div className="row gx-5">
            <ProductImages productImages={data.images} />
            <div className="col-lg-6">
              <div className="product-info">
                <MainInfo mainInfo={data.mainInfo} rtl={rtl} />
                <div className="color-quantity">
                  <ColorSelect rtl={rtl} />
                  <AddToCart rtl={rtl} style={style} />
                </div>
                <MoreInfo moreInfo={data.moreInfo} rtl={rtl} />
                <SocialIcons />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Product