/**
 * Eyebrow — the numbered gold section label: "• [01] ABOUT ME" (SPEC §3 Section label).
 * Server component (no hooks).
 *
 * Props
 *   number     "01", "02" … — computed by the page from the rendered order; omit to hide the badge
 *   label      text (rendered upper-case in Latin via CSS; never upper-cased or tracked in Arabic)
 *   as         'p' (default) | 'h2' (or any heading tag) — use 'h2' when the panel has no other heading
 *              (Skills, Expertise, Projects, Experience, Testimonials); About & Contact keep a <p>
 *   id         id for aria-labelledby (put it on the Eyebrow when it is the panel's heading)
 *   className  extra class (e.g. margins)
 *
 * The dot and the number are decorative (aria-hidden): the accessible text is the label only.
 * The dot hangs ~18px outside the badge toward inline-start (it sits in the panel padding).
 */
import cx from '../cx';
import styles from './Eyebrow.module.scss';

export default function Eyebrow({ number, label, as: Tag = 'p', id, className }) {
  return (
    <Tag id={id} className={cx(styles.eyebrow, className)}>
      <span className={styles.dot} aria-hidden="true" />
      {number ? (
        <span className={styles.number} aria-hidden="true">
          {number}
        </span>
      ) : null}
      <span className={styles.label}>{label}</span>
    </Tag>
  );
}
