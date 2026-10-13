/**
 * BrowserFrame — dark browser-window chrome around a screenshot (SPEC §5: 3 dots, 12px radius).
 * Server component (no hooks). Internal to the case-study page.
 *
 * Props
 *   children   the screenshot (<Image …/> from next/image)
 *   tall       true → full-page capture: a fixed-height (max(360px, 70vh)) scroll region that is
 *              keyboard-focusable (tabIndex 0) and labelled (role="region" + aria-label) instead of a
 *              shrunken image. false → the whole image is shown.
 *   label      accessible name of the scroll region (required when `tall`; must be unique on the page)
 *   hint       visible "Scroll to explore" pill for tall frames (decorative — the label already says it)
 *   width      natural image width in px (with `trim`)
 *   trim       px of a captured browser scrollbar track to hide on the image's right edge (FIGURES.md);
 *              the image is scaled so the track falls outside the frame
 *   maxWidth   max frame width in px (keeps 1× captures from being upscaled); omitted → fills the parent
 *   compact    true → a lower scroll region (max 440px) for frames inside cards
 *   className  extra class on the frame
 *
 * Screenshots are never mirrored in RTL: the media box is always dir="ltr" (the chrome follows the page).
 */
import cx from '../../ui/cx';
import Icon from '../../ui/Icon/Icon';
import styles from './BrowserFrame.module.scss';

export default function BrowserFrame({ children, tall = false, label, hint, width, trim = 0, maxWidth, compact = false, className }) {
  const style = {};
  if (maxWidth) style.maxWidth = `${Math.round(maxWidth) + 2}px`; // + the 1px borders
  if (trim > 0 && width > trim) style['--frame-trim'] = String(width / (width - trim));

  return (
    <div className={cx(styles.frame, tall && styles.tall, compact && styles.compact, trim > 0 && styles.trimmed, className)} style={style}>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>
        <span className={styles.address} />
      </div>
      {tall ? (
        <div className={styles.viewport} role="region" aria-label={label} tabIndex={0} dir="ltr">
          {children}
        </div>
      ) : (
        <div className={styles.media} dir="ltr">
          {children}
        </div>
      )}
      {tall && hint ? (
        <>
          <span className={styles.fade} aria-hidden="true" />
          <span className={styles.hint} aria-hidden="true">
            <Icon name="arrow-down" size={14} className={styles.hintIcon} />
            {hint}
          </span>
        </>
      ) : null}
    </div>
  );
}
