/**
 * Footer — the site footer on every page (SPEC §4.8), exactly like the reference: a faint panel-shaped box
 * 10px under the last panel, holding the logo · "© {year} Sajid Ali. All rights reserved." · "Privacy Policy"
 * and "Terms of Service" (our real /privacy and /terms pages) · the round back-to-top button.
 * Mobile: a centred stack.
 *
 * export default async function Footer({ locale })
 *   locale  "en" | "ar"
 *
 * The year is the build year (pages are static). The <footer> stays a direct child of <body> (print CSS).
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '../../../i18n/navigation';
import Logo from '../../ui/Logo/Logo';
import BackToTop from '../BackToTop/BackToTop';
import styles from './Footer.module.scss';

export default async function Footer({ locale }) {
  const t = await getTranslations({ locale, namespace: 'layout' });
  // A string, so ICU doesn't format it as a number ("2,026" / Arabic-Indic digits).
  const year = String(new Date().getFullYear());

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.box}>
          <Logo locale={locale} className={styles.logo} />
          <p className={styles.copy}>{t('footer.copyright', { year })}</p>
          <nav className={styles.legal} aria-label={t('footer.legal')}>
            <ul className={styles.links} role="list">
              <li>
                <Link href="/privacy" className={styles.link}>
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className={styles.link}>
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </nav>
          <BackToTop label={t('footer.backToTop')} className={styles.top} />
        </div>
      </div>
    </footer>
  );
}
