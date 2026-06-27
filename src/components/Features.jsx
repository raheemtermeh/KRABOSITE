import features from "@data/App/features.json";
import featuresRTL from "@data/App/features-rtl.json";

const Features = ({ rtl, banner }) => {
  const featuresData = rtl ? featuresRTL : features;

  ("banner");
  (banner);
  return (
    <section className="features pt-70 pb-70 style-4" data-scroll-index="1">
      <div className="container">
        <div className="section-head text-center style-4">
          <small className="title_small bg-white">
            متن تستی مثلا تخفیف ویژه یا هر چی
          </small>
          <h2 className="mb-70">
            پشنهاد ویژه
            <span>
              کرابو
              {/* { rtl ? 'رائعة' : 'Features' } */}
            </span>{" "}
          </h2>
        </div>
        <div className="content">
          {banner &&
            banner.data &&
            banner.data.length > 0 &&
            banner.data.map((banner, index) => (
              <div className="features-card" key={index}>
                <div className="icon img-contain">
                  <img
                    className="test"
                    src={`https://python.krabo.gold/${banner.image && banner.image.length > 21 && banner.image.slice(21)}`}
                    alt=""
                  />
                  <span className="label icon-40 alert-success text-success rounded-circle small text-uppercase fw-bold">
                    پشنهادی
                  </span>
                </div>
                <h6>
                  {" "}
                  <br />
                  {banner.name}
                </h6>
              </div>
            ))}
        </div>
      </div>
      <img src="/assets/img/feat_circle.png" alt="" className="img-circle" />
    </section>
  );
};

export default Features;
