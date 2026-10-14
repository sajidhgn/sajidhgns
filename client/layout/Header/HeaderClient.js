'use client';

/**
 * HeaderClient — the interactive part of the Header (internal to client/layout/Header; Header.js renders it).
 *
 * export default function HeaderClient({ locale, items, navLabel, ctaLabel })   ('use client')
 *   locale    "en" | "ar"
 *   items     [{ id, label }] in page order — ids are the home page's section ids
 *   navLabel  accessible name of the <nav> (layout.nav.label)
 *   ctaLabel  "Let's Talk"
 *
 * - Sticky header; after 8px of scroll it gets the blurred background + bottom line (data-scrolled).
 * - Home page: links are in-page anchors (#about …) and an IntersectionObserver scroll-spy marks the
 *   section crossing a reading line 38–40% down the viewport (first / last section at the very top /
 *   bottom of the page). A section the visitor picks (click, or the hash of a deep link) stays marked
 *   until they scroll themselves, so a smooth scroll past other sections doesn't flicker and short
 *   sections near the bottom stay selected. About and Skills share a row on desktop: the URL hash breaks the tie.
 * - Other pages: links go to /<locale>#<id> (next-intl Link); /work and /work/* mark Projects.
 * - The active link gets aria-current="true", gold text, a gold line and a glowing dot (reference "Home").
 * - Without JavaScript (< 1024px) the menu button is hidden and a plain link row is shown instead.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, usePathname } from '../../../i18n/navigation';
import Logo from '../../ui/Logo/Logo';
import Button from '../../ui/Button/Button';
import cx from '../../ui/cx';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import MobileMenu from '../MobileMenu/MobileMenu';
import styles from './Header.module.scss';

const SCROLLED_AT = 8;
const SPY_BAND = '-38% 0px -60% 0px';
const RELEASE_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

const hrefFor = (id, onHome) => {
  if (onHome) return `#${id}`;
  return id === 'home' ? '/' : `/#${id}`;
};

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

export default function HeaderClient({ locale, items = [], navLabel, ctaLabel }) {
  const pathname = usePathname() || '/';
  const onHome = pathname === '/';
  const onWork = pathname === '/work' || pathname.startsWith('/work/');

  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const links = useMemo(() => items.map((item) => ({ ...item, href: hrefFor(item.id, onHome) })), [items, onHome]);

  const [scrolled, setScrolled] = useState(false);
  const [spy, setSpy] = useState(ids[0] ?? null);
  const pinned = useRef(null);

  let active = null;
  if (onHome) active = spy;
  else if (onWork) active = 'projects';

  // Sticky state.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLLED_AT);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  // Scroll-spy (home page only).
  useEffect(() => {
    if (!onHome) return undefined;
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const inBand = new Set();
    const hashId = () => {
      try {
        return decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return '';
      }
    };
    if (ids.includes(hashId())) pinned.current = hashId();

    const pick = () => {
      if (pinned.current) {
        setSpy(pinned.current);
        return;
      }
      const root = document.documentElement;
      if (window.scrollY <= 2) {
        setSpy(sections[0].id);
      } else if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) {
        setSpy(sections[sections.length - 1].id);
      } else {
        const hits = sections.filter((section) => inBand.has(section)).map((section) => section.id);
        if (!hits.length) return; // in a gap between panels: keep the current one
        const hash = hashId();
        setSpy(hits.includes(hash) ? hash : hits[0]);
      }
    };

    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) inBand.add(entry.target);
            else inBand.delete(entry.target);
          });
          pick();
        },
        { rootMargin: SPY_BAND }
      );
      sections.forEach((section) => observer.observe(section));
    }

    let frame = 0;
    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          pick();
        });
      }
    };
    const release = () => {
      pinned.current = null;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    RELEASE_EVENTS.forEach((type) => window.addEventListener(type, release, { passive: true }));
    pick();

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      RELEASE_EVENTS.forEach((type) => window.removeEventListener(type, release));
      window.cancelAnimationFrame(frame);
      pinned.current = null;
    };
  }, [onHome, ids]);

  // A section chosen from the nav (desktop, mobile sheet or Let's Talk) stays marked until the visitor scrolls.
  const onNavigate = useCallback(
    (id) => {
      if (!onHome) return;
      pinned.current = id;
      setSpy(id);
    },
    [onHome]
  );

  const ctaHref = onHome ? '#contact' : '/#contact';

  return (
    <header className={styles.header} data-scrolled={scrolled ? 'true' : undefined}>
      <div className={cx('container', styles.inner)}>
        <Logo locale={locale} className={styles.logo} />

        <nav className={styles.nav} aria-label={navLabel}>
          <ul className={styles.list} role="list">
            {links.map((item) => (
              <li key={item.id}>
                <NavAnchor
                  href={item.href}
                  className={styles.link}
                  title={item.label}
                  aria-current={item.id === active ? 'true' : undefined}
                  onClick={() => onNavigate(item.id)}
                >
                  {item.label}
                </NavAnchor>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <LanguageSwitch locale={locale} />
          <Button href={ctaHref} variant="outline" icon="send" className={styles.cta} onClick={() => onNavigate('contact')}>
            {ctaLabel}
          </Button>
          <MobileMenu
            locale={locale}
            items={links}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            active={active}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* No JavaScript, no menu sheet: below 1024px the links are shown as a plain row instead. */}
      <noscript>
        <nav className={cx('container', styles.fallback)} aria-label={navLabel}>
          <ul className={styles.fallbackList} role="list">
            {items.map((item) => (
              <li key={item.id}>
                <a className={styles.fallbackLink} title={item.label} href={`/${locale}${item.id === 'home' ? '' : `#${item.id}`}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </noscript>
    </header>
  );
}
