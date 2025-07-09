'use client';
import { Link } from "react-scroll";
import { useTranslations } from "next-intl";
import Image from "next/image";
import MobileMenu from "../MobileMenu/MobileMenu";
import LanguageSwitcher from "../language-switcher";

const Header = () => {
    const t = useTranslations();
    const menus = t.raw("menu");


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

                    {
                      menus.map((menu, index) => (
                        <li key={index}>
                          <Link
                            activeClass="active"
                            to={menu.link}
                            spy={true}
                            smooth={true}
                            duration={500}
                          >
                            {menu.name}
                          </Link>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 col-md-2 col-2">
                <div className="header-right">
                  <LanguageSwitcher />
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
