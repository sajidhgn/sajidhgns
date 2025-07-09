'use client';
import ContactForm from "../ContactFrom/ContactForm";
import SectionTitle from "../SectionTitle/SectionTitle";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const ContactArea = (props) => {
    const t = useTranslations("contact");


  return (
    <section
      className={`wpo-contact-area section-padding ${props.contactclass}`}
      id="contact"
    >
      <div className="wpo-wpo-contact-form-map">
        <div className="container">
          <div className="row justify-content-center">
            <SectionTitle Title={t('title')} />
            <div className="col-lg-6 col-md-12 col-12">
              <div className="wpo-contact-profile">
                <Image
                  src="/sajidhgn.png"
                  alt="profile-image"
                  quality={75}
                  className="img-fluid"
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  width={96}
                  height={96}
                />
              </div>
              <div className="wpo-contact-about">
                <p>
                 {t('description')}
                </p>
                <div className="wpo-contact-social">
                  <p>{t('sub_description')}</p>
                  <ul>
                    <li>
                      <Link target="_blank" href="https://github.com/sajidhgn"><i className="fa fa-github"></i></Link>
                    </li>
                    <li>
                      <Link  target="_blank" href="https://www.linkedin.com/in/sajidhgn/"><i className="fa fa-linkedin"></i></Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="row justify-content-center">
                <div className="col col-lg-6 col-md-12 col-12">
                  <div className="wpo-contact-form">
                    <h2>{t('get_in_touch')}</h2>
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="shape-wk">
        <svg width="1500" height="1500" viewBox="0 0 1500 1500" fill="none">
          <g opacity="0.45" filter="url(#filter0_f_39_4214)">
            <circle cx="750" cy="750" r="200" />
          </g>
          <defs>
            <filter
              id="filter0_f_39_4214"
              x="0"
              y="0"
              width="1500"
              height="1500"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="275"
                result="effect1_foregroundBlur_39_4212"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default ContactArea;
