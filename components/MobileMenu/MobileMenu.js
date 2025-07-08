"use client";
import React, { useState } from 'react';
import { Link } from 'react-scroll'


const MobileMenu = () => {

    const [menuActive, setMenuState] = useState(false);



    return (
        <div>
            <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
                <div className="menu-close">
                    <div className="clox" onClick={() => setMenuState(!menuActive)}><i className="ti-close"></i></div>
                </div>

                <ul className="responsivemenu">
                
                    <li>
                        <Link activeClass="active" to="home" spy={true} smooth={true} duration={500}>Home</Link>
                    </li>
                    <li>
                        <Link activeClass="active" to="about" spy={true} smooth={true} duration={500}>About</Link>
                    </li>
                    <li>
                        <Link activeClass="active" to="experience" spy={true} smooth={true} duration={500}>Experience</Link>
                    </li>
                    <li>
                        <Link activeClass="active" to="portfolio" spy={true} smooth={true} duration={500} >Portfolio</Link>
                    </li>
                    <li>
                        <Link activeClass="active" to="contact" spy={true} smooth={true} duration={500}>Contact</Link>
                    </li>

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