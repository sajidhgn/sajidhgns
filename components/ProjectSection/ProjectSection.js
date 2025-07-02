import React from "react";
import Image from "next/image";
import Link from "next/link";
import Projects from "../../api/project";

const ProjectSection = () => {
  return (
    <div className="wpo-project-area section-padding" id="portfolio">
      <div className="container">
        <div className="wpo-section-title-s2">
          <div className="row align-items-center">
            <div className="col-lg-12 col-12">
              <div className="title text-center">
                <h2>Portfolio</h2>
                <p>A curated selection of my recent work and expertise.</p>
              </div>
            </div>
          
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="wpo-work-area bg-transparent">
              <div className="wpo-work-wrap">
                {Projects.map((project, pro) => (
                  <div className="wpo-work-item p-0" key={pro}>
                    <div className="row">
                      <div className="col-lg-4 col-12">
                        <div className="wpo-project-img position-relative p-3">
                          <Image
                            src={`/${project.pImg}`}
                            alt={project.title}
                            quality={75}
                            className="img-fluid"
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "290px",
                            }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            width={0}
                            height={0}
                          />
                        </div>
                      </div>
                      <div className="col-lg-8 col-12">
                        <div className="wpo-pros p-3">
                        <div className="wpo-project-text">
                          <h2
                           
                            className="mb-4"
                          >
                            <Link className="link-hover" href="/" target="_blank" rel="noopener noreferrer">
                                                                    {project.title}
                                                                </Link>
                            
                          </h2>
                          <span>{project.subTitle}</span>
                          <ul className="row mt-4 features-list">
                            {project?.features?.map((item, index) => (
                              <li
                                key={index}
                                className="col-lg-6 col-md-6 col-12 py-1"
                              >
                                <i className="ti-arrow-right"> </i>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                        <ul className="tags-list mt-4">
                          {project?.tags?.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="shape-p">
        <svg width="1325" height="1687" viewBox="0 0 1325 1687" fill="none">
          <g filter="url(#filter0_f_39_4166)">
            <circle cx="481.5" cy="843.5" r="343.5" fillOpacity="0.27" />
          </g>
          <defs>
            <filter
              id="filter0_f_39_4166"
              x="-362"
              y="0"
              width="1687"
              height="1687"
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
                result="effect1_foregroundBlur_39_4166"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="line-shape-1">
        <img src="images/project/line-1.png" alt="" />
      </div>
      <div className="line-shape-2">
        <img src="images/project/line-2.png" alt="" />
      </div>
    </div>
  );
};

export default ProjectSection;
