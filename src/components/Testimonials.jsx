import { useState } from 'react';
import ModalVideo from "react-modal-video";
import testimonialsData from '@data/App/testimonials.json';
import testimonialsDataRTL from '@data/App/testimonials-rtl.json';
import "react-modal-video/css/modal-video.css";

const Testimonials = ({ rtl }) => {
  const [isOpen, setOpen] = useState(false);
  const data = rtl ? testimonialsDataRTL : testimonialsData;

  const openVideo = (e) => {
    e.preventDefault();
    setOpen(true);
  }

  return (
    <section className="testimonials style-4 pt-70" data-scroll-index="5">
      <div className="container">
        <div className="content">
          <div className="row">
            <div className="col-lg-5">
              <div className="section-head style-4">
                <small className="title_small">{ rtl ? 'اراء العملاء' : 'Testimonials' }</small>
                <h2 className="mb-30">{ rtl ? 'محبوب من' : 'Loved From' } <span>{ rtl ? 'العملاء' : 'Customers' }</span></h2>
              </div>
              <p className="text mb-40">
                { rtl ? 'أحب نوتيرو من آلاف العملاء في جميع أنحاء العالم وحصل على الثقة من الشركات الكبرى.' : 'Notero loved from thoudsands customer worldwide and get trusted from big companies.' }
              </p>
              <div className="numbs">
                {
                  data.numCards.map((card, index) => (
                    <div className="num-card" key={index}>
                      <div className="icon img-contain">
                        <img src={card.image} alt="" />
                      </div>
                      <h2>{ card.value }</h2>
                      {
                        card.stars &&
                        <div className="stars">
                          { Array(card.stars).fill().map((_,i) => <i className="fas fa-star" key={i}></i>) }
                        </div>
                      }
                      <p>{ typeof card.type === 'string' ? card.type : (<>{card.type.text1} <br /> {card.type.text2}</>) }</p>
                    </div>
                  ))
                }
              </div>
              <div className="d-flex align-items-center mt-70">
                <a href="https://www.apple.com/app-store" rel="noreferrer" className="btn rounded-pill bg-blue4 fw-bold text-white me-4" target="_blank">
                  <small> { rtl ? 'انظر التعليقات على متجر التطبيقات' : 'See Reviews On App Store' }</small>
                </a>
                <a href="https://youtu.be/pGbIOC83-So?t=21" className="play-btn" onClick={openVideo}>
                  <span className="icon me-2">
                    <i className="fas fa-play ms-1"></i>
                  </span>
                  <strong className="small">{ rtl ? 'مشاهده' : 'View' } <br />{ rtl ? 'البرومو' : 'Promotion' }</strong>
                </a>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="testi-cards">
                {
                  data.testiCards.map((card, index) => (
                    <div className="client_card" key={index}>
                      <div className="user_img">
                        <img src={card.userImg} alt="" />
                      </div>
                      <div className="inf_content">
                        <div className="stars mb-2">
                          { Array(card.stars).fill().map((_,i) => <i className="fas fa-star" key={i}></i>) }
                        </div>
                        <h6>
                          { typeof card.title === 'string' ? card.title : (<>{card.title.text1} <br /> {card.title.text2}</>) }
                        </h6>
                        <p>{ card.author.name } <span className="text-muted"> /  { card.author.position } { rtl ? 'في' : 'at' } <span>{ card.author.company }</span> </span></p>
                      </div>
                    </div>
                  ))
                }
                <img src="/assets/img/contact_globe.svg" alt="" className="testi-globe" />
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </section>
  )
}

export default Testimonials