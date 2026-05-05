"use client";
import { Link } from "react-scroll";
import NextLink from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import MobileMenu from "../MobileMenu/MobileMenu";
import LanguageSwitcher from "../language-switcher";

const Header = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const params = useParams();

  const menus = t.raw("menu") || [];
  const currentLocale = params?.locale || "en";
  const isHome = pathname === "/" || pathname === `/${currentLocale}`;

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
                  <div className="navbar-brand site-logo">
                    <Image
                      src="/images/logo.png"
                      alt="Sajidhgn Logo"
                      title="Sajidhgn Home"
                      style={{
                        objectFit: "cover",
                      }}
                      priority
                      quality={75}
                      width={80}
                      height={55}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-1 col-1">
                <div
                  id="navbar"
                  className="collapse navbar-collapse navigation-holder"
                >
                  <button className="menu-close" title="Close Menu">
                    <i className="ti-close"></i>
                  </button>
                  <ul className="nav navbar-nav mb-2 mb-lg-0">
                    {menus?.map((menu, index) => {
                      if (!menu.link) return null;

                      return (
                        <li key={index}>
                          {isHome ? (
                            <Link
                              activeClass="active"
                              to={menu.link}
                              spy={true}
                              smooth={true}
                              duration={500}
                              title={menu.name}
                              style={{ cursor: "pointer" }}
                            >
                              {menu.name}
                            </Link>
                          ) : (
                            <NextLink
                              href={`/${currentLocale}/#${menu.link}`}
                              title={menu.name}
                            >
                              {menu.name}
                            </NextLink>
                          )}
                        </li>
                      );
                    })}
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
