'use client';
import { useTranslations } from "next-intl";

const Footer = () => {

    const t = useTranslations("footer");

    return (
        <footer className="wpo-site-footer">
            <div className="lower-footer">
                <div className="container">
                    <div className="row">
                        <div className="separator"></div>
                        <p className="copyright">{t('copyright')}</p>
                    </div>
                </div>
            </div>
            <a
                href="https://api.whatsapp.com/send?phone=923434366924"
                className="whatsapp-sticky"
                target="_blank"
                rel="noopener noreferrer"
                title="Contact me on WhatsApp"
            >
                <i className="fa fa-whatsapp"></i>
            </a>
        </footer>
    )
}

export default Footer;