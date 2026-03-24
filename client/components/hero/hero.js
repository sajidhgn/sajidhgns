"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function Hero({ data, locale }) {
  const t = useTranslations("banner");

  const greetings = data?.greetings?.[locale] || t("greatings");
  const subTitle = data?.subTitle?.[locale] || t("subTitle");
  const title = data?.title?.[locale] || t("title");
  const description = data?.description?.[locale] || t("description");
  const buttonText = data?.buttonText?.[locale] || t("button");

  return (
    <section className="static-hero" id="home">
      <div className="hero-container">
        <div className="hero-inner">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-6 col-lg-6 col-12">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="wpo-static-hero-inner"
                >
                  {/* animate__animated animate__fadeInDown */}
                  <div data-swiper-parallax="300" className="slide-title">
                    <h2>
                      <span>{greetings}, </span>
                      {subTitle}.
                    </h2>
                  </div>
                  <div data-swiper-parallax="300" className="slide-sub-title">
                    <h5>{title}</h5>
                  </div>
                  <div data-swiper-parallax="400" className="slide-text">
                    <p>{description}</p>
                  </div>
                  <div className="clearfix"></div>
                  <div className="slide-btn">
                    <a
                      className="theme-btn"
                      download="sajid-frontend-resume"
                      href={data?.resumeUrl || "/sajid-frontend-resume.pdf"}
                      title={buttonText}
                    >
                      {buttonText}
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, y: "-50%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="static-hero-right"
      >
        <div className="static-hero-img">
          <div className="static-hero-img-inner">
            <img src="/images/hero-graphic.svg" alt="Professional Web Development Illustration" title="Web Development Services" />
          </div>
        </div>
      </motion.div>
      <div className="shape-1">
        <svg width="1038" height="938" viewBox="0 0 1038 938" fill="none">
          <g opacity="0.5" filter="url(#filter0_f_39_4392)">
            <circle cx="290.5" cy="282.5" r="247.5" />
          </g>
          <defs>
            <filter
              id="filter0_f_39_4392"
              x="-457"
              y="-465"
              width="1495"
              height="1495"
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
                stdDeviation="250"
                result="effect1_foregroundBlur_39_4392"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="shape-2">
        <svg width="1295" height="938" viewBox="0 0 1295 938" fill="none">
          <g opacity="0.4" filter="url(#filter0_f_39_4393)">
            <circle cx="647.5" cy="561.5" r="247.5" />
          </g>
          <defs>
            <filter
              id="filter0_f_39_4393"
              x="0"
              y="-86"
              width="1295"
              height="1295"
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
                stdDeviation="200"
                result="effect1_foregroundBlur_39_4393"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="shape-3">
        <svg width="752" height="747" viewBox="0 0 752 747" fill="none">
          <g opacity="0.45" filter="url(#filter0_f_39_4394)">
            <circle cx="647.5" cy="99.5" r="247.5" />
          </g>
          <defs>
            <filter
              id="filter0_f_39_4394"
              x="0"
              y="-548"
              width="1295"
              height="1295"
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
                stdDeviation="200"
                result="effect1_foregroundBlur_39_4394"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="line-shape-1">
        <img src="images/slider/line-1.png" alt="Decorative background line" title="Decorative Element" />
      </div>
      <div className="line-shape-2">
        <img src="images/slider/line-2.png" alt="Decorative background shape" title="Decorative Element" />
      </div>
    </section>
  );
}
