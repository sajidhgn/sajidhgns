'use client';

/**
 * BackToTop — the footer's round gold-arrow button (SPEC §4.8).
 *
 * export default function BackToTop({ label, className })   ('use client')
 *   label      accessible name (layout.footer.backToTop)
 *   className  extra class
 *
 * A plain <a href="#top">, so it works without JavaScript ("#top" is the top of the document in HTML;
 * CSS smooth-scrolls it when motion is allowed). With JavaScript it scrolls without adding "#top" to the
 * URL, and when it was activated from the keyboard it moves focus to the top of the page too (the skip
 * link, the page's first focusable element) instead of leaving it at the bottom.
 * 44×44 target; the visible circle is 38px like the reference.
 */
import Icon from '../../ui/Icon/Icon';
import cx from '../../ui/cx';
import styles from './BackToTop.module.scss';

export default function BackToTop({ label = 'Back to top', className }) {
  const onClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    const smooth = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    // detail === 0: activated with the keyboard (Enter), not a pointer click.
    if (event.detail === 0) {
      const first = document.querySelector('[data-skip-link]') || document.querySelector('header a[href]');
      first?.focus({ preventScroll: true });
    }
  };

  return (
    <a href="#top" className={cx(styles.top, className)} aria-label={label} title={label} onClick={onClick}>
      <Icon name="arrow-up" size={16} className={styles.icon} />
    </a>
  );
}
