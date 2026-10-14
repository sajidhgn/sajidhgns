/**
 * CaseNext — "Next project" panel: the next project in display order (wrapping around) as a ProjectCard,
 * plus "View all projects →" (SPEC §5 (5)). Async server component.
 *
 * export default async function CaseNext({ slug, locale, number, className })
 *   slug       CURRENT project slug (the next one comes from getNextProject(slug))
 *   locale     "en" | "ar"
 *   number     eyebrow number (continues the page's sequence); omit to hide the badge
 *   className  extra class on the panel
 *
 * Labels: case.next.*. The card itself is the projects builder's ProjectCard (title as <h3>).
 */
import { getTranslations } from 'next-intl/server';
import { getNextProject } from '../../../content/projects';
import { Link } from '../../../i18n/navigation';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Icon from '../../ui/Icon/Icon';
import cx from '../../ui/cx';
import ProjectCard from '../../sections/ProjectCard/ProjectCard';
import styles from './CaseNext.module.scss';

export default async function CaseNext({ slug, locale, number, className }) {
  const next = getNextProject(slug);
  if (!next || next.slug === slug) return null;
  const t = await getTranslations({ locale, namespace: 'case' });
  const label = (key) => (t.has(key) ? t(key) : '');

  return (
    <Panel id="case-next" labelledBy="case-next-title" className={cx(styles.next, className)}>
      <div className={styles.head}>
        <Eyebrow as="h2" id="case-next-title" number={number} label={label('next.label')} />
        <Link href="/work" className={styles.all} title={label('next.all')}>
          {label('next.all')}
          <Icon name="arrow-right" size={16} className={styles.allIcon} />
        </Link>
      </div>
      <div className={styles.card}>
        <ProjectCard slug={next.slug} locale={locale} headingLevel="h3" />
      </div>
    </Panel>
  );
}
