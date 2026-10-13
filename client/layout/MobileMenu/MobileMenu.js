'use client';

/**
 * MobileMenu — the < 1024px menu button and its full-height sheet (SPEC §3).
 *
 * export default function MobileMenu({ locale, items, ctaLabel, ctaHref, active, onNavigate })   ('use client')
 *   locale      "en" | "ar"
 *   items       [{ id, href, label }] — the header's nav items; href is "#id" on the home page, "/#id" elsewhere
 *   ctaLabel    "Let's Talk" label
 *   ctaHref     optional, default "/#contact" ("#contact" on the home page)
 *   active      optional id of the current item (scroll-spy) → aria-current + gold
 *   onNavigate  optional (id) => void, called when a nav item is chosen (the header pins its scroll-spy)
 *
 * Behaviour: 44×44 toggle (aria-expanded, aria-controls) → a modal sheet (role="dialog", aria-modal) rendered
 * in a portal on <body>: logo + close button where the toggle was, large nav links in a panel, the language
 * switch and "Let's Talk". Focus moves to the close button and is trapped inside; Esc and the close button
 * close it and return focus to the toggle; choosing a link closes it (the browser then moves to the target).
 * While open: page scroll is locked (`scroll-lock` on <html> only — see styles/_utilities.scss) and the rest of
 * the page is inert. It closes itself when the viewport grows to ≥ 1024px.
 * Without JavaScript the toggle is hidden and the header shows a plain link row instead (Header).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/navigation';
import Icon from '../../ui/Icon/Icon';
import Logo from '../../ui/Logo/Logo';
import Button from '../../ui/Button/Button';
import cx from '../../ui/cx';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import styles from './MobileMenu.module.scss';

const SHEET_ID = 'site-menu';
const DESKTOP = '(min-width: 1024px)';
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
// Everything outside the sheet that must not be reachable while it is open.
const BACKGROUND = 'body > header, body > main, body > footer, body > a[href="#main"]';

function NavAnchor({ href, children, ...rest }) {
  if (href.startsWith('#')) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

export default function MobileMenu({ locale, items = [], ctaLabel, ctaHref = '/#contact', active, onNavigate }) {
  const t = useTranslations('layout');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef(null);
  const sheetRef = useRef(null);
  const closeRef = useRef(null);
  const returnFocus = useRef(false);

  useEffect(() => setMounted(true), []);

  const close = useCallback((restoreFocus) => {
    returnFocus.current = restoreFocus;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    const toggle = toggleRef.current;
    const background = [...document.querySelectorAll(BACKGROUND)];

    root.classList.add('scroll-lock');
    background.forEach((node) => {
      node.inert = true;
    });
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== 'Tab' || !sheetRef.current) return;
      const nodes = [...sheetRef.current.querySelectorAll(FOCUSABLE)].filter((node) => node.getClientRects().length > 0);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const inside = sheetRef.current.contains(document.activeElement);
      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia(DESKTOP);
    const onViewport = () => {
      if (desktop.matches) close(false);
    };

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onViewport);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onViewport);
      root.classList.remove('scroll-lock');
      background.forEach((node) => {
        node.inert = false;
      });
      if (returnFocus.current) toggle?.focus({ preventScroll: true });
      returnFocus.current = false;
    };
  }, [open, close]);

  // Any link inside the sheet (nav item, logo, language, Let's Talk) closes it; the navigation itself runs as usual.
  const onSheetClick = (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const id = link.getAttribute('data-nav-id');
    if (id && onNavigate) onNavigate(id);
    close(false);
  };

  const sheet = (
    <div
      ref={sheetRef}
      id={SHEET_ID}
      className={cx(styles.sheet, open && styles.open)}
      role="dialog"
      aria-modal="true"
      aria-label={t('menu.label')}
      data-print="hide"
      onClick={onSheetClick}
    >
      <div className={cx('container', styles.bar)}>
        <Logo locale={locale} />
        <button
          ref={closeRef}
          type="button"
          className={styles.button}
          aria-label={t('menu.close')}
          onClick={() => close(true)}
        >
          <Icon name="x" size={20} />
        </button>
      </div>

      <div className={cx('container', styles.body)}>
        <nav className={styles.panel} aria-label={t('nav.label')}>
          <ul className={styles.list} role="list">
            {items.map((item, index) => {
              const current = item.id === active;
              return (
                <li key={item.id}>
                  <NavAnchor
                    href={item.href}
                    className={styles.link}
                    data-nav-id={item.id}
                    aria-current={current ? 'true' : undefined}
                  >
                    <span className={styles.index} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.label}>{item.label}</span>
                    <Icon name="arrow-up-right" size={18} className={styles.arrow} />
                  </NavAnchor>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <LanguageSwitch locale={locale} />
          {ctaLabel ? (
            <Button href={ctaHref} icon="send" className={styles.cta} data-nav-id="contact">
              {ctaLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={cx(styles.button, styles.toggle)}
        aria-label={t('menu.label')}
        aria-expanded={open}
        aria-controls={SHEET_ID}
        onClick={() => setOpen(true)}
      >
        <Icon name="menu" size={20} />
      </button>
      {mounted ? createPortal(sheet, document.body) : null}
    </>
  );
}
