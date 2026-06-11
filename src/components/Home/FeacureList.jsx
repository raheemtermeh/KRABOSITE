// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
// import { faHome, faEnvelope, faDollarSign } from '@fortawesome/free-solid-svg-icons'; // Add necessary icons
// import { useEffect, useState } from 'react';
// import gift from "../../../public/assets/img/logo.png"


// const FeatureList = () => {
//     const [isVisible, setIsVisible] = useState(false);

//     // Adding a simple scroll animation trigger
//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollPosition = window.scrollY;
//             if (scrollPosition > 100) {
//                 setIsVisible(true);
//             }
//         };
//         window.addEventListener('scroll', handleScroll);

//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     // Keyframes for animations (inline with @keyframes)
//     const fadeInKeyframes = `
//         @keyframes fadeIn {
//             from { opacity: 0; }
//             to { opacity: 1; }
//         }
//         @keyframes fadeInLeft {
//             from { opacity: 0; transform: translateX(-50px); }
//             to { opacity: 1; transform: translateX(0); }
//         }
//     `;

//     // Adding the styles as objects
//     const featureItemStyle = {
//         border: '1px solid #880a0a50',
//         borderRadius: '20px',
//         padding: '15px',
//         marginBottom: '20px',
//         transition: 'transform 0.3s ease',
//     };

//     const iconStyle = {
//         width: '50px',
//         color: '#880a0a',
//         border: '1px solid #880a0a',
//         borderRadius: '50%',
//         padding: '10px',
//         transition: 'transform 0.3s ease',
//     };

//     const containerStyle = {
//         opacity: isVisible ? 1 : 0,
//         animation: isVisible ? 'fadeIn 1s ease' : '',
//     };

//     const itemAnimationDelayStyle = (delay) => ({
//         opacity: isVisible ? 1 : 0,
//         animation: isVisible ? `fadeInLeft 1s ease ${delay}s` : '',
//     });

//     return (
//         <>
//             {/* Embedding keyframe animations directly in the component */}
//             <style>
//                 {fadeInKeyframes}
//             </style>

//             <div className="container mt-4 mb-10" style={containerStyle}>
//                 <div className="row align-items-center">
//                     <div className="col-md-6 text-md-right text-center mb-4 mb-md-0">
//                         <img
//                             src={gift.src}
//                             className="img-fluid"
//                             alt="gift"
//                             style={{ animation: isVisible ? 'fadeIn 1s ease' : '',width:250 }}
//                         />
//                     </div>

//                     <div className="col-md-6">
//                         <div className="feature-item" style={{ ...featureItemStyle, ...itemAnimationDelayStyle(0),marginLeft:100 }}>
//                             <FontAwesomeIcon icon={faDollarSign} style={iconStyle}/>
//                             <p className="d-inline p-8">قیمت مناسب نسبت به رقبا</p>
//                         </div>
//                         <div className="feature-item" style={{ ...featureItemStyle, ...itemAnimationDelayStyle(0.2),marginRight:100 }}>
//                             <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />
//                             <p className="d-inline p-8">ارسال به موقع کالا</p>
//                         </div>
//                         <div className="feature-item" style={{ ...featureItemStyle, ...itemAnimationDelayStyle(0.4),marginLeft:100 }}>
//                             <FontAwesomeIcon icon={faDollarSign} style={iconStyle} />
//                             <p className="d-inline p-8">ساخت مطابق با سلیقه شما</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default FeatureList;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faCogs, faTags } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import { useEffect, useState } from 'react';
import gift from "../../../public/assets/img/logo.png";


const FeatureList = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Adding a simple scroll animation trigger
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 100) {
                setIsVisible(true);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Keyframes for animations (inline with @keyframes)
    const fadeInKeyframes = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
        }
    `;

    // Adding the styles as objects
    const featureItemStyle = {
        border: '1px solid #880a0a50',
        borderRadius: '20px',
        padding: '15px',
        marginBottom: '20px',
        transition: 'transform 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        textAlign: 'right',
    };

    const iconStyle = {
        width: '45px',
        height: '45px',
        color: '#880a0a',
        border: '1px solid #880a0a',
        borderRadius: '50%',
        padding: '10px',
        transition: 'transform 0.3s ease',
    };

    const containerStyle = {
        opacity: isVisible ? 1 : 0,
        animation: isVisible ? 'fadeIn 1s ease' : '',
    };

    const itemAnimationDelayStyle = (delay) => ({
        opacity: isVisible ? 1 : 0,
        animation: isVisible ? `fadeInLeft 1s ease ${delay}s` : '',
    });

    const textStyle = {
        fontSize: '1.1rem',
        margin: 0,
    };

    return (
        <>
            {/* Embedding keyframe animations directly in the component */}
            <style>
                {fadeInKeyframes}
            </style>

            <div className="container mt-4 mb-10" style={containerStyle}>
                <div className="row align-items-center">
                    <div className="col-md-6 text-md-right text-center mb-4 mb-md-0">
                        <img
                            src={gift.src}
                            className="img-fluid"
                            alt="gift"
                            style={{ animation: isVisible ? 'fadeIn 1s ease' : '', width: '100%', maxWidth: '250px' }}
                        />
                    </div>

                    <div className="col-md-6">
                        <div className="feature-item" style={{ ...featureItemStyle, ...itemAnimationDelayStyle(0) }}>
                            <FontAwesomeIcon icon={faTags} style={iconStyle} />
                            <p className="d-inline" style={textStyle}>قیمت مناسب نسبت به رقبا</p>
                        </div>
                        <div className="feature-item" style={{ ...featureItemStyle, ...itemAnimationDelayStyle(0.2) }}>
                            <FontAwesomeIcon icon={faTruck} style={iconStyle} />
                            <p className="d-inline" style={textStyle}>ارسال به موقع کالا</p>
                        </div>
                        <div className="feature-item" style={{ ...featureItemStyle, ...itemAnimationDelayStyle(0.4) }}>
                            <FontAwesomeIcon icon={faCogs} style={iconStyle} />
                            <p className="d-inline" style={textStyle}>ساخت مطابق با سلیقه شما</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeatureList;

