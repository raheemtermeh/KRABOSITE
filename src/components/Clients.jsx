import clients from '@data/App/clients.json';

const Clients = ({ rtl }) => {
  return (
    <section className="clients style-4">
      <div className="container">
        <div className="text-center">
          <h5 className="fw-bold mb-60"><span className="color-blue4">{ rtl ? '25K+ تحميل' : '25K+ Installation' }</span> { rtl ? 'واستخدام الخدمات' : 'and Featured on' }</h5>
        </div>
        <div className="client-logos pb-70">
          <div className="row align-items-center">
            {
              clients.map((client, index) => (
                <div className="col-6 col-lg-2" key={index}>
                  <a href="#" className="img d-block">
                    <img src={client} alt="" />
                  </a>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default Clients