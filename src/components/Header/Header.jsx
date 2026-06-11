import { useState } from 'react';
import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.css";

const Header = ({ rtl }) => {
  const [isOpen, setOpen] = useState(false);

  const openVideo = (e) => {
    e.preventDefault();
    setOpen(true);
  }

  return (
    <header className="style-4" data-scroll-index="0">
      <div className="content">
        <div className="container">
          <div className="row gx-0">
            <div className="col-lg-6">
              <div className="info">
                <small className="mb-50 title_small">{ rtl ? 'نوتيرو - تطبيق مذكرة سهل الاستخدام' : 'Notero - Easy Notes App' }</small>
                <h1 className="mb-30">{ rtl ? 'احفظ' : 'Note' } <span>{ rtl ? 'كل شئ' : 'Your Everything' }</span> { rtl ? 'على التطبيق' : 'In One App' }</h1>
                <p className="text">{ rtl ? 'لا يلزم الترميز لإجراء التخصيصات. يحتوي المُخصص المباشر' : 'No coding required to make customizations. The live customizer' }<br />{ rtl ? 'على كل ما تحتاجه.' : 'has everything you need.' }</p>
                <div className="d-flex align-items-center mt-50">
                  <a href="https://www.apple.com/app-store" rel="noreferrer" className="btn rounded-pill bg-blue4 fw-bold text-white me-4" target="_blank">
                    <small> <i className="fab fa-apple me-2 pe-2 border-end"></i>{ rtl ? 'تحميل التطبيق' : 'Download App' }</small>
                  </a>
                  <a href="https://youtu.be/pGbIOC83-So?t=21" data-lity className="play-btn" onClick={openVideo}>
                    <span className="icon me-2">
                      <i className="fas fa-play ms-1"></i>
                    </span>
                    <strong className="small">{ rtl ? 'مشاهدة' : 'View' } <br />{ rtl ? 'البرومو' : 'Promotion' }</strong>
                  </a>
                </div>
                <span className="mt-100 me-5">
                  <small
                    className="icon-30 bg-gray rounded-circle color-blue4 d-inline-flex align-items-center justify-content-center me-2">
                    <i className="fas fa-sync"></i>
                  </small>
                  <small className="text-uppercase">{ rtl ? 'مجانى لمده 14 يوم' : 'Free 14 Days Trial' }</small>
                </span>
                <span className="mt-100">
                  <small
                    className="icon-30 bg-gray rounded-circle color-blue4 d-inline-flex align-items-center justify-content-center me-2">
                    <i className="fas fa-credit-card"></i>
                  </small>
                  <small className="text-uppercase">{ rtl ? 'دفعة لمرة واحدة' : 'One time payment' }</small>
                </span>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="img">
                <img src="/assets/img/header/header_4.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <img src="/assets/img/header/header_4_bubble.png" alt="" className="bubble" />
      </div>
      <img src="/assets/img/header/header_4_wave.png" alt="" className="wave" />
      {
        typeof window !== "undefined" && 
          (
            <ModalVideo
              channel="youtube"
              autoplay
              isOpen={isOpen}
              videoId="pGbIOC83-So"
              onClose={() => setOpen(false)}
            />
          )
      }
    </header>
  )
}

export default Header