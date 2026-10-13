/**
 * Segments — renders a headline from message segments (SCHEMA.md):
 *   [{ "text": "I Design Intuitive" }, { "break": true }, { "text": "Digital " }, { "text": "Experiences", "accent": true }]
 * Server- and client-safe (no hooks).
 *
 * Props
 *   segments   array as above (a plain string is rendered as-is; null/undefined renders nothing)
 *   className  optional class for a wrapping <span> (without it the segments render as a fragment,
 *              so the parent heading controls the typography)
 *
 * `accent` → gold <span>. `break` → <br class="br-desktop"> (only ≥ 768px) preceded by a space, so on mobile
 * the words on both sides of the break stay separated while the heading wraps naturally.
 */
import { Fragment } from 'react';
import styles from './Segments.module.scss';

export default function Segments({ segments, className }) {
  if (segments == null) return null;

  const parts = typeof segments === 'string'
    ? segments
    : (Array.isArray(segments) ? segments : []).map((segment, index) => {
        if (!segment) return null;
        if (segment.break) {
          return (
            <Fragment key={index}>
              {' '}
              <br className="br-desktop" />
            </Fragment>
          );
        }
        if (segment.accent) {
          return (
            <span key={index} className={styles.accent}>
              {segment.text}
            </span>
          );
        }
        return <Fragment key={index}>{segment.text}</Fragment>;
      });

  return className ? <span className={className}>{parts}</span> : <>{parts}</>;
}
