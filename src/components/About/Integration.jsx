
const Integration = ({ integrations, rtl }) => {
  return (
    <div className="integration pt-60" data-scroll-index="3">
      <div className="section-head text-center style-4">
        <small className="title_small">{ rtl ? 'دفعة لمرة واحدة' : 'One-Time Payment' }</small>
        <h2 className="mb-20">{ rtl ? 'متوافق مع' : 'Integration With' } <span>{ rtl ? 'التطبيقات الشعبية' : 'Popular Apps' }</span> </h2>
        <p>{ rtl ? 'نوتيرو يتكامل مع التطبيقات الشعبية. تساعدك على التواصل والتعاون بسهولة' : 'Notero intergrate with popular apps. Help you easy to connect and collaboration' }</p>
      </div>
      <div className="container">
        <div className="content">
          {
            integrations.map((integration, index) => (
              <div className="img" key={index}>
                <img src={integration} alt="" className="mt-30" />
              </div>
            ))
          }
        </div>
      </div>
      <img src="/assets/img/about/intg_back.png" alt="" className="intg-back" />
    </div>
  )
}

export default Integration