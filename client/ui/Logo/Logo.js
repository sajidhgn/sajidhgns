/**
 * Logo — hexagon outline mark (34×39, gold) with an "S" monogram + the "SAJID.ALI" wordmark ("SAJID" 700, ".ALI" 400).
 * Links home (locale-aware). Server- and client-safe.
 *
 * Props
 *   locale     current locale ("en" | "ar") — passed to the link
 *   className  extra class on the link (e.g. a smaller footer variant)
 *
 * Accessible name: messages layout.brand.homeLink ("Sajid Ali — home"); the mark is decorative.
 * The wordmark stays Latin and left-to-right in both locales (brand name).
 */
import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/navigation';
import cx from '../cx';
import styles from './Logo.module.scss';

/** The hexagon mark alone (decorative). `size` is the width; the pointy-top hexagon is 39/34 as tall. */
export function LogoMark({ size = 34, className }) {
  return (
    <svg
      className={cx(styles.mark, className)}
      width={size}
      height={Math.round((size * 39) / 34)}
      viewBox="0 0 34 39"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M15.4 1.72A3.2 3.2 0 0 1 18.6 1.72L31.59 9.23A3.2 3.2 0 0 1 33.19 12L33.19 27A3.2 3.2 0 0 1 31.59 29.77L18.6 37.28A3.2 3.2 0 0 1 15.4 37.28L2.41 29.77A3.2 3.2 0 0 1 0.81 27L0.81 12A3.2 3.2 0 0 1 2.41 9.23Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M22.4 14.1C21.6 12.2 19.6 11.1 17.1 11.1 14 11.1 11.9 12.8 11.9 15.2 11.9 17.7 14 18.6 17 19.3 20.3 20 22.4 21.1 22.4 23.7 22.4 26.3 20.1 27.9 16.9 27.9 14.4 27.9 12.4 26.8 11.5 24.9"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ locale, className }) {
  const t = useTranslations('layout');
  const label = t.has('brand.homeLink') ? t('brand.homeLink') : 'Sajid Ali — home';

  return (
    <Link href="/" locale={locale} className={cx(styles.logo, className)} aria-label={label}>
      <LogoMark />
      <span className={styles.word} dir="ltr" lang="en" translate="no">
        <span className={styles.strong}>SAJID</span>
        <span className={styles.light}>.ALI</span>
      </span>
    </Link>
  );
}
