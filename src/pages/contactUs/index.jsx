import FooterMobile from "@components/Navbars/AppNav/FooterMobile";
import Navbar from "@components/Navbars/AppNav/kraboHeader";
import MainLayout from "@layouts/Main";
import QRCODE from "../../../public/assets/img/instaQR.jpg"
import fs from 'fs';

export default function ContactUs({header}){

    return(<>
     <MainLayout isRTL>
    <Navbar header={header?.data?.data}
              location={"home"}
              rtl/>
    
      <h3>  
        <title>تماس با ما</title>  
      </h3>  
      <div className="container mt-5">  
        <h1 className="text-center mb-20" style={{ color: '#880a0a', fontWeight: 'bold' }}>تماس با ما</h1>  
        <div className="text-center mb-20">  
        </div>  

        <div className="row justify-content-center">  
          <div className="col-md-6">  
            <div className="card shadow-lg">  
              <div className="card-body">  
                <h4 className="card-title" style={{ color: '#880a0a' }}>راه های ارتباطی:</h4>  
                <ul className="list-unstyled">  
                  <li className="mb-10" style={{ color: '#880a0a', fontSize: '18px' }}>  
                    <strong>گالری:</strong><p style={{color:"#999"}}> بندرعباس-پاساژ ستاره شهر-طبقه همکف-پلاک ۳۴  </p> 
                  </li>  
                  <li className="mb-10" style={{ color: '#880a0a', fontSize: '18px' }}>  
                    <strong>تلفن:</strong> <a href="tel:1234567890" style={{ color: '#999' }}>۰۷۶۳۲۲۳۰۶۱۲</a>  
                  </li>  
                  <li className="mb-10" style={{ color: '#880a0a', fontSize: '18px' }}>  
                    <strong>دفتر مرکزی و تولیدی:</strong><p style={{color:"#999"}}>تهران-خیابان بهشت-روبروی پارک شهر-کوچه انصاری-بن بست خدادادی</p> 
                  </li>  
                  <li className="mb-10" style={{ color: '#880a0a', fontSize: '18px' }}>  
                    <strong>(واتس اپ)تلفن:</strong> <a href="tel:1234567890" style={{ color: '#999' }}>۰۹۰۳۱۷۸۷۷۸۹</a>
                  </li>  
                  <li className="mb-10" style={{ color: '#880a0a', fontSize: '18px' }}>  
                    <strong>ایمیل:</strong> <a href="mailto:info@example.com" style={{ color: '#999' }}>krabogalley@gmail.com</a>  
                  </li>  
                  <li className="mb-10" style={{ color: '#880a0a', fontSize: '18px' }}>  
                    <strong>اینستاگرام:</strong> <a href="https://www.instagram.com/krabo.gold?igsh=MXQyM3U2b293MTltZg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ color: '#999' }}>krabo.gold</a>  
                  </li>  
                </ul>  
              </div>  
            </div>  
          </div>  
        </div>  
        
        <div className="text-center mt-5">  
          <h5 style={{ color: '#880a0a', fontWeight: 'bold' }}>مارا در اینستاگرام دنبال کنید</h5>  
          <img className="collection-image" src={QRCODE.src} style={{width:"30%"}} alt="instagram QR code" />

         <div > <a href="https://www.instagram.com/krabo.gold?igsh=MXQyM3U2b293MTltZg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger m-5" style={{ borderColor: '#880a0a',backgroundColor:"#880a0a",color:'#fff' }}>  
            کلیک کنید   </a> </div> 
        </div>  
        <div style={{height:100}}></div>
      </div> 
     </MainLayout>
     <FooterMobile location="home" header={header?.data?.data}/>
    </>)
}

export async function getServerSideProps(context) {

  let header = {} 
  
  
  // const headerPath = 'D:/Aida/projects/krabo-frontend/header.json';  
  const headerPath = "../../../header.json";  
  
  
  
  try {

    const data = fs.readFileSync(headerPath, 'utf-8');
    header = {
          status : 200 ,
          success : true , 
          data : JSON.parse(data)
      }

  } catch (error) {
    header = {
      status : 500 , 
      message : "not found" , 
      success : false
    }

    
}


return {
  props: {
    header: header,
  },
};

 
}