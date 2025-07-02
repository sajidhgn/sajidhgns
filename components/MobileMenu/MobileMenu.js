import React, { Fragment, useState } from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import { Link } from 'react-scroll'
import NavLink from 'next/link'

const menus = [
    {
        id: 1,
        title: 'Home',
        link: 'home',
        submenu: [
            {
                id: 11,
                title: 'Home style 1',
                link: '/'
            },
            {
                id: 12,
                title: 'Home style 2',
                link: '/home2'
            },
            {
                id: 13,
                title: 'Home style 3',
                link: '/home3'
            }
        ]
    },

]


const MobileMenu = () => {

    const [openId, setOpenId] = useState(0);
    const [menuActive, setMenuState] = useState(false);

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

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
                        <Link activeClass="active" to="portfolio" spy={true} smooth={true} duration={500} onClick={ClickHandler}>Portfolio</Link>
                    </li>
                                        <li>
                        <Link activeClass="active" to="testimonial" spy={true} smooth={true} duration={500}>Testimonial</Link>
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