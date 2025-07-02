import React from 'react'


const Footer = () => {
      const currentYear = new Date().getFullYear();

    return (
        <footer className="wpo-site-footer">
            <div className="lower-footer">
                <div className="container">
                    <div className="row">
                        <div className="separator"></div>
                        <p className="copyright">Copyright &copy; {currentYear} Sajidhgn. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;