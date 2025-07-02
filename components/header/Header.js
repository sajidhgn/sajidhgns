import React from "react";
import { Link } from "react-scroll";
import Image from "next/image";
import MobileMenu from "../MobileMenu/MobileMenu";

const Header = (props) => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <header id="header" className="wpo-header-style-1">
      <div className="wpo-site-header">
        <nav className="navigation navbar navbar-expand-lg navbar-light">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block">
                <MobileMenu />
              </div>
              <div className="col-lg-2 col-md-6 col-6">
                <div className="navbar-header">
                  <Link className="navbar-brand site-logo" href="/">
                    <Image
                      src="/images/logo.png"
                      alt=""
                      style={{
                        objectFit: "cover"
                      }}
                      priority
                      quality={75}
                      width={80}
                      height={55}
                    />
                  </Link>
                </div>
              </div>
              <div className="col-lg-8 col-md-1 col-1">
                <div
                  id="navbar"
                  className="collapse navbar-collapse navigation-holder"
                >
                  <button className="menu-close">
                    <i className="ti-close"></i>
                  </button>
                  <ul className="nav navbar-nav mb-2 mb-lg-0">
                    <li>
                      <Link
                        activeClass="active"
                        to="home"
                        spy={true}
                        smooth={true}
                        duration={500}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        activeClass="active"
                        to="about"
                        spy={true}
                        smooth={true}
                        duration={500}
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        activeClass="active"
                        to="portfolio"
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={ClickHandler}
                      >
                        Portfolio
                      </Link>
                    </li>

                    <li>
                      <Link
                        activeClass="active"
                        to="testimonial"
                        spy={true}
                        smooth={true}
                        duration={500}
                      >
                        Testimonial
                      </Link>
                    </li>
                    <li>
                      <Link
                        activeClass="active"
                        to="contact"
                        spy={true}
                        smooth={true}
                        duration={500}
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 col-md-2 col-2">
                <div className="header-right">
                  <div className="header-btn">
                    <a
                      onClick={ClickHandler}
                      className="theme-btn"
                      download="My Cv"
                      href="images/cv.jpg"
                      title="ImageName"
                    >
                      <img
                        className="hide-img"
                        alt="ImageName"
                        src="images/cv.jpg"
                      />
                      Resume
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
