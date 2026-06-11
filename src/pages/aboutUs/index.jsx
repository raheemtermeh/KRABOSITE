import Navbar from "@components/Navbars/AppNav/kraboHeader";  
import MainLayout from "@layouts/Main";  

export default function AboutUs() {  
  return (  
    <>  
      <MainLayout isRTL>  
        <Navbar />  
        
        <h3>  
          <title>درباره ما</title>  
        </h3>  
          <h1 className="text-center mb-4" style={{ color: '#880a0a', fontWeight: 'bold' }}>درباره ما</h1>  
          <div className="text-center mb-4">  
            <p style={{ fontSize: '18px', color: '#880a0a' }}>  
              ما به عنوان یک برند جواهرات، به طراحی و ساخت قطعات منحصر به فرد با بهترین مواد اولیه متعهد هستیم.  
            </p>  
          </div>  
          
          <div className="row justify-content-center">  
            <div className="col-md-6">  
              <div className="card shadow-lg">  
                <div className="card-body">  
                  <h4 className="card-title" style={{ color: '#880a0a' }}>چرا انتخاب ما؟</h4>  
                  <p style={{ color: '#880a0a', fontSize: '18px' }}>  
                    ما جواهرات را با عشق و دقت طراحی و تولید می‌کنیم. هر قطعه از ما داستانی برای گفتن دارد و ما به زیبایی و کیفیت آن‌ها افتخار می‌کنیم.  
                  </p>  
                </div>  
              </div>  
            </div>  
          </div>  

          <div className="row mt-5">  
            <div className="col-md-4">  
              <img src="/images/jewelry1.jpg" alt="Jewelry Piece 1" />  
            </div>  
            <div className="col-md-4">  
              <img src="/images/jewelry2.jpg" alt="Jewelry Piece 2"  />  
            </div>  
            <div className="col-md-4">  
              <img src="/images/jewelry3.jpg" alt="Jewelry Piece 3" />  
            </div>  
          </div>  
          
          <div className="text-center mt-5">  
            <h5 style={{ color: '#880a0a', fontWeight: 'bold' }}>با ما در ارتباط باشید!</h5>  
            <p style={{ color: '#880a0a' }}>برای کسب اطلاعات بیشتر و مشاهده جواهرات بیشتر، به صفحه تماس ما مراجعه کنید.</p>  
          </div>  
      </MainLayout>  
    </>  
  );  
}  