/**
 * Panel — the rounded bento container every section sits in (SPEC §3 Panels).
 * Server component (no hooks).
 *
 * Props
 *   as          element, default 'section' (a labelled <section> becomes a region landmark)
 *   id          anchor id (#about, #projects …) — scroll-padding keeps it clear of the sticky header
 *   className   extra class; module styles override the primitive (it lives in the `ui` cascade layer),
 *               e.g. `overflow: visible` for an element that straddles the edge, or a custom padding
 *   labelledBy  id of the panel's heading → aria-labelledby
 *   glow        true → faint gold corner glow at the inline-start top corner
 *   children
 *   …rest       passed through (aria-label, data-*, style …)
 *
 * Box: var(--panel-grad) background, 1px var(--line) border, var(--r-panel) radius, inset top highlight,
 * overflow hidden, padding var(--panel-pad-block) var(--panel-pad-inline) (20/40 desktop, 20/24 tablet, 20/20 mobile).
 */
import cx from '../cx';
import styles from './Panel.module.scss';

export default function Panel({ as: Tag = 'section', id, className, labelledBy, glow = false, children, ...rest }) {
  return (
    <Tag id={id} className={cx(styles.panel, glow && styles.glow, className)} aria-labelledby={labelledBy} {...rest}>
      {children}
    </Tag>
  );
}
