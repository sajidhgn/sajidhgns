"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import SectionTitle from "../SectionTitle/SectionTitle";

export default function ExprienceSec() {
  const t = useTranslations("experience_section");
  const experiences = t.raw("work_experience");

  return (
    <div className="wpo-work-area section-padding" id="experience">
      <div className="container">
        <SectionTitle Title={t("title")} />
        <div className="wpo-work-wrap">
          {experiences.map((exprience, exp) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: exp * 0.1 }}
              className="wpo-work-item"
              key={exp}
            >
              <ul>
                <li className="date">{exprience.date}</li>
                <li className="logo">
                  <span>
                    <img src={exprience.logo} alt="exprience-logo" title="exprience-logo" />
                  </span>
                </li>
                <li className="position">
                  {exprience.position}{" "}
                  <span>
                    {exprience.companyName} <span>{exprience.workFrom}</span>
                  </span>
                </li>
                <li className="link">
                  <Link
                    href={exprience.webLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {exprience.button}
                  </Link>
                </li>
              </ul>
            </motion.div>
          ))}
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
    </div>
  );
}
