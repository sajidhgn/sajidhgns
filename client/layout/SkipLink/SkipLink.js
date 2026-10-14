/**
 * SkipLink — the first focusable element on every page: "Skip to main content" → #main (the layout's
 * <main id="main" tabIndex={-1}>). Visually hidden until it receives keyboard focus, then a gold pill
 * at the top inline-start corner. Server component (no props).
 *
 * export default function SkipLink()
 */
import { useTranslations } from 'next-intl';
import styles from './SkipLink.module.scss';

export default function SkipLink() {
  const t = useTranslations('layout');
  return (
    <a href="#main" className={styles.skip} data-skip-link="" title={t('skipToContent')}>
      {t('skipToContent')}
    </a>
  );
}
