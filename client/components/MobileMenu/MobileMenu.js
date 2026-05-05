"use client";
import React, { useState } from 'react';
import { Link } from 'react-scroll';
import NextLink from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';


const MobileMenu = () => {

    const [menuActive, setMenuState] = useState(false);
    const pathname = usePathname();
    const params = useParams();
    const currentLocale = params?.locale || 'en';
    const isHome = pathname === '/' || pathname === `/${currentLocale}`;

    const t = useTranslations();
    const menus = t.raw("menu") || [];


    return (
        <div>
            <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
                <div className="menu-close">
                    <div className="clox" onClick={() => setMenuState(!menuActive)}><i className="ti-close"></i></div>
                </div>

                <ul className="responsivemenu">

                    {
                        menus.map((menu, index) => {
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
                                            onClick={() => setMenuState(false)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {menu.name}
                                        </Link>
                                    ) : (
                                        <NextLink
                                            href={`/${currentLocale}/#${menu.link}`}
                                            onClick={() => setMenuState(false)}
                                        >
                                            {menu.name}
                                        </NextLink>
                                    )}
                                </li>
                            );
                        })
                    }
                </ul>

            </div>

            <div className="showmenu" onClick={() => setMenuState(!menuActive)}>
                <button type="button" className="navbar-toggler open-btn">
                    <span className="icon-bar first-angle"></span>
                    <span className="icon-bar middle-angle"></span>
                    <span className="icon-bar last-angle"></span>
                </button>
            </div>
        </div>
    )
}

export default MobileMenu;