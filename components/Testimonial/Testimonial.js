import React, { useState } from 'react';
import Slider from "react-slick";

const testimonial = [
    {
        id: '01',
        tImg: 'images/testimonial/img-1.jpg',
        tTitle:'Many desktop publishing packages and editors now use as their.',
        Des: "It is a long established fact that a reader will be distracted by the readable content of page when looking at its layout point of using is that it has more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making look like readable English.",
        Title: 'Cathi Falcon',
        Sub: "Founder",
    },
    {
        id: '02',
        tImg: 'images/testimonial/img-2.jpg',
        tTitle:'Many desktop publishing packages and editors now use as their.',
        Des: "It is a long established fact that a reader will be distracted by the readable content of page when looking at its layout point of using is that it has more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making look like readable English.",
        Title: 'Harry Abraham',
        Sub: "SCG First Company",
    },
    {
        id: '03',
        tImg: 'images/testimonial/img-3.jpg',
        tTitle:'Many desktop publishing packages and editors now use as their.',
        Des: "It is a long established fact that a reader will be distracted by the readable content of page when looking at its layout point of using is that it has more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making look like readable English.",
        Title: 'Benjir Walton',
        Sub: "Merketer",
    },
    {
        id: '04',
        tImg: 'images/testimonial/img-4.jpg',
        tTitle:'Many desktop publishing packages and editors now use as their.',
        Des: "It is a long established fact that a reader will be distracted by the readable content of page when looking at its layout point of using is that it has more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making look like readable English.",
        Title: 'Benjir Walton',
        Sub: "Merketer",
    },
    {
        id: '05',
        tImg: 'images/testimonial/img-5.jpg',
        tTitle:'Many desktop publishing packages and editors now use as their.',
        Des: "It is a long established fact that a reader will be distracted by the readable content of page when looking at its layout point of using is that it has more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making look like readable English.",
        Title: 'Benjir Walton',
        Sub: "Merketer",
    },
    {
        id: '06',
        tImg: 'images/testimonial/img-6.jpg',
        tTitle:'Many desktop publishing packages and editors now use as their.',
        Des: "It is a long established fact that a reader will be distracted by the readable content of page when looking at its layout point of using is that it has more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making look like readable English.",
        Title: 'Benjir Walton',
        Sub: "Merketer",
    },
]

const Testimonial = () => {

    const [nav1, setNav1] = useState();
    const [nav2, setNav2] = useState();


    return (
        <section className="wpo-testimonial-section section-padding" id='testimonial'>
            <div className="container">
                <div className="wpo-testimonial-wrap">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-12">
                            <div className="testimonial-left">
                                <div className="testimonial-left-inner">
                                    <div className="slider-for">
                                        <Slider asNavFor={nav2} ref={(slider1) => setNav1(slider1)} dots={false} arrows={false} fade={true}>
                                            {
                                                testimonial.map((tesmnl, tsm) => (
                                                    <div className="testimonial-img" key={tsm}>
                                                        <img src={tesmnl.tImg} alt="" />
                                                    </div>
                                                ))
                                            }
                                        </Slider>
                                    </div>
                                    <div className="side-img-1"><img src='images/testimonial/img-2.jpg' alt="" /></div>
                                    <div className="side-img-2"><img src='images/testimonial/img-3.jpg' alt="" /></div>
                                    <div className="side-img-3"><img src='images/testimonial/img-4.jpg' alt="" /></div>
                                    <div className="side-img-4"><img src='images/testimonial/img-5.jpg' alt="" /></div>
                                    <div className="side-img-5"><img src='images/testimonial/img-6.jpg' alt="" /></div>
                                    <div className="border-s1"></div>
                                    <div className="border-s2"></div>
                                    <div className="border-s3"></div>
                                </div>
                                <div className="shape-t">
                                    <svg width="750" height="750" viewBox="0 0 750 750" fill="none">
                                        <g filter="url(#filter0_f_39_4154)">
                                            <circle r="125" transform="matrix(-1 0 0 1 375 375)" fillOpacity="0.4" />
                                        </g>
                                        <defs>
                                            <filter id="filter0_f_39_4154" x="0" y="0" width="750" height="750"
                                                filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                                    result="shape" />
                                                <feGaussianBlur stdDeviation="125"
                                                    result="effect1_foregroundBlur_39_4154" />
                                            </filter>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="wpo-testimonial-items">
                                <div className="slider-nav">
                                    <Slider
                                        asNavFor={nav1}
                                        ref={(slider2) => setNav2(slider2)}
                                        slidesToShow={1}
                                        dots={true}
                                        swipeToSlide={true}
                                        focusOnSelect={true}
                                    >
                                        {
                                            testimonial.map((tesmnl, tsm) => (
                                                <div className="wpo-testimonial-item" key={tsm}>
                                                    <div className="wpo-testimonial-text">
                                                        <h4>{tesmnl.tTitle}</h4>
                                                        <p>{tesmnl.Des}</p>
                                                        <div className="wpo-testimonial-text-btm">
                                                            <h3>{tesmnl.Title}, <span>{tesmnl.Sub}</span></h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }

                                    </Slider>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="left-shape"></div>
            <div className="right-shape"><img src="images/testimonial/shape.png" alt="" /></div>
        </section>
    );
}

export default Testimonial;