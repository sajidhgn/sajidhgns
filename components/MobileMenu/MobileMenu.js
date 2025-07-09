"use client";
import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { useTranslations } from 'next-intl';


const MobileMenu = () => {

    const [menuActive, setMenuState] = useState(false);
    const t = useTranslations();
    const menus = t.raw("menu");


    return (
        <div>
            <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
                <div className="menu-close">
                    <div className="clox" onClick={() => setMenuState(!menuActive)}><i className="ti-close"></i></div>
                </div>

                <ul className="responsivemenu">

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