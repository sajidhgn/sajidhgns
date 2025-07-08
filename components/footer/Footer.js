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
        </footer>
    )
}

export default Footer;