
import {Shop,handleClick } from './index';
import axios from 'axios';
import { useRouter } from 'next/router';

const C = ({ 
  rtl ,

  category,

}) => {
  const router =useRouter() ;



  return (<></>
    // <div className="filter-card mb-30">
     

    //   <div className="card-title">
    //     <span onClick={()=>{
    //       (category)
    //       ("category")
    //       (router.query.idSubCategory)
          
    //       }}>دسته بندی محصولات</span>
    //   </div>
    
      
    //   {category.length > 0 && category.map((data,index)=>(
    //     <div key={index} className="form-check category-checkRadio">
    //     <input defaultChecked={router.query.idSubCategory === data.slug}  className="form-check-input defaultChecked" type="radio" name="category" id="category2" />
    //     <label                    className="form-check-label cat-link"  htmlFor="category2">
    //     {data.name}
    //     </label>
    //   </div>
    
    //   ))}
      
      
      
    // </div>
  )
}

export default C