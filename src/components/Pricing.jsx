import Link from 'next/link';
import plans from '@data/App/plans.json';
import plansRTL from '@data/App/plans-rtl.json';

const Pricing = ({ rtl }) => {
  const data = rtl ? plansRTL : plans;

  return (
    <section className="pricing section-padding style-4 pb-50" data-scroll-index="6">
      <div className="container">
        <div className="section-head text-center style-4">
          <small className="title_small">{ rtl ? 'خطة الاسعار' : 'Pricing Plan' }</small>
          <h2 className="mb-30">{ rtl ? 'ابدأ بـ' : 'Start With' } <span> { rtl ? 'سعر مناسب' : 'Affordable Price' } </span> </h2>
        </div>
        <div className="content">
          <div className="toggle_switch d-flex align-items-center justify-content-center mb-40">
            <div className="form-check form-switch p-0">
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault"><small>{ rtl ? 'تدفع شهريا' : 'Billed monthly' }</small></label>
              <input className="form-check-input float-none bg-blue4" type="checkbox" id="flexSwitchCheckDefault" defaultChecked />
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault"><small>{ rtl ? 'دفع سنوى' : 'Billed annually' }</small></label>
            </div>
          </div>
          <div className="row gx-0">
            {
              data.map((plan, index) => (
                <div className="col-lg-6" key={index}>
                  <div className="price-card">
                    <div className="price-header pb-4">
                      <h6> <img src={plan.image} alt="" className="icon" /> { plan.title } </h6>
                      <h2>{ plan.price } <small> / { rtl ? 'شهري' : 'month' }</small></h2>
                      <p>{ plan.description }</p>
                    </div>
                    <div className="price-body py-4">
                      <ul>
                        {
                          plan.features.map((feature, i) => (
                            <li className={`d-flex align-items-center mb-3 ${feature.active ? '':' op-3'}`} key={i}>
                              <small className="icon-30 bg-blue4 rounded-circle text-white d-inline-flex align-items-center justify-content-center me-3 flex-shrink-0">
                                <i className={feature.icon}></i>
                              </small>
                              <p className="fw-bold">{ feature.title }</p>
                            </li>
                          ))
                        }
                      </ul>
                      <Link href="/page-contact-5">
                        <a className={`btn rounded-pill ${index === 0 ? 'border-blue4':'bg-blue4'} hover-blue4 fw-bold mt-50 px-5 ${index === 0 ? 'border-blue4':'text-white'}`}>
                          <small>{ rtl ? 'سجل الان' : 'Register Now' }</small>
                        </a>
                      </Link>
                    </div>
                    {
                      plan.off &&
                        <div className="off">
                          <span>
                            { plan.off } <br /> { rtl ? 'خصم' : 'off' }
                          </span>
                        </div>
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing