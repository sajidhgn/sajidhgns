'use client';

/**
 * LanguageSwitch — the compact "EN | ع" control in the header and the mobile menu (SPEC allowed deviation 1:
 * styled like the "Let's Talk" outline button, but smaller — 36px tall).
 *
 * export default function LanguageSwitch({ locale, className })   ('use client')
 *   locale     current locale "en" | "ar"
 *   className  extra class on the group
 *
 * - The other language is a next-intl <Link href={pathname} locale="…">, so the current page is kept
 *   (/en/work/healthsia ⇄ /ar/work/healthsia); the URL hash (#projects …) is kept on the client.
 * - The current language is plain text marked aria-current="true" (one tab stop, nothing to click).
 * - Accessible names are the language names in their own language (English / العربية) with matching
 *   `lang` (+ `hrefLang` on the link); the visible "EN" / "ع" is aria-hidden. The group is labelled
 *   layout.language.label ("Language").
 */
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '../../../i18n/navigation';
import { routing } from '../../../i18n/routing';
import cx from '../../ui/cx';
import styles from './LanguageSwitch.module.scss';

const SHORT = { en: 'EN', ar: 'ع' };

export default function LanguageSwitch({ locale, className }) {
  const t = useTranslations('layout');
  const pathname = usePathname() || '/';
  const [hash, setHash] = useState('');

  // The hash only exists on the client. Re-read it on every way it can change: hash links (hashchange),
  // history (popstate), client navigations (pathname) — and right before use (focus / pointer), because
  // Next's router updates the hash with pushState, which fires no event.
  const readHash = useCallback(() => setHash(window.location.hash), []);
  useEffect(() => {
    readHash();
    window.addEventListener('hashchange', readHash);
    window.addEventListener('popstate', readHash);
    return () => {
      window.removeEventListener('hashchange', readHash);
      window.removeEventListener('popstate', readHash);
    };
  }, [pathname, readHash]);

  return (
    <div className={cx(styles.switch, className)} role="group" aria-label={t('language.label')}>
      {routing.locales.map((code, index) => {
        const name = t(`language.${code}`);
        const current = code === locale;
        return (
          <Fragment key={code}>
            {index > 0 ? <span className={styles.sep} aria-hidden="true" /> : null}
            {current ? (
              <span className={cx(styles.option, styles.current)} lang={code} aria-current="true">
                <span className={styles.short} aria-hidden="true">
                  {SHORT[code]}
                </span>
                <span className="visually-hidden">{name}</span>
              </span>
            ) : (
              <Link
                href={`${pathname}${hash}`}
                locale={code}
                lang={code}
                hrefLang={code}
                title={name}
                className={styles.option}
                onFocus={readHash}
                onPointerEnter={readHash}
                onPointerDown={readHash}
              >
                <span className={styles.short} aria-hidden="true">
                  {SHORT[code]}
                </span>
                <span className="visually-hidden">{name}</span>
              </Link>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
