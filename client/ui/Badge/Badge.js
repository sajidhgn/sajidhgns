/**
 * Badge — the availability pill: halo dot + text (SPEC §4.1). The text is always present (the dot alone
 * never carries meaning). Server component (no hooks).
 *
 * Props
 *   children   text, e.g. "Available for new opportunities"
 *   tone       'mint' (default, available) | 'gold'
 *   as         element, default 'p' (it is a status line; pass 'span' inside inline contexts)
 *   className  extra class
 */
import cx from '../cx';
import styles from './Badge.module.scss';

export default function Badge({ children, tone = 'mint', as: Tag = 'p', className }) {
  return (
    <Tag className={cx(styles.badge, styles[tone], className)}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.text}>{children}</span>
    </Tag>
  );
}
