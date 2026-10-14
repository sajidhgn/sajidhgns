/**
 * CaseHero — the case study's first panel and the page's only <h1> (SPEC §5). Async server component.
 *
 * export default async function CaseHero({ slug, locale })
 *   slug    project slug (unknown → renders nothing; the page 404s first)
 *   locale  "en" | "ar"
 *
 * Left: "← All projects" (→ /work), the category as the eyebrow, <h1> title, the headline (deck) and the
 * summary, then Primary "Visit live site ↗" (only with a liveUrl) and Outline "Download CV".
 * Right (stacked below on small screens): the CaseMeta "Project details" card.
 * Never wrapped in Reveal (it paints with the page). Text: projects.items.<slug>.*; labels: case.*.
 */
import { getTranslations } from 'next-intl/server';
import { site } from '../../../content/site';
import { Link } from '../../../i18n/navigation';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import CaseMeta from '../CaseMeta/CaseMeta';
import { getCase } from '../caseContent';
import styles from './CaseHero.module.scss';

export default async function CaseHero({ slug, locale }) {
  const data = await getCase(slug, locale);
  if (!data) return null;
  const t = await getTranslations({ locale, namespace: 'case' });
  const label = (key) => (t.has(key) ? t(key) : '');

  return (
    <Panel labelledBy="case-title" glow className={styles.hero}>
      <div className={styles.copy}>
        <Link href="/work" className={styles.back} title={label('backToWork')}>
          <Icon name="arrow-left" size={16} className={styles.backIcon} />
          {label('backToWork')}
        </Link>
        {data.category ? <Eyebrow label={data.category} className={styles.eyebrow} /> : null}
        <h1 id="case-title" className={styles.title}>
          {data.title}
        </h1>
        {data.headline ? <p className={styles.headline}>{data.headline}</p> : null}
        {data.summary ? <p className={styles.summary}>{data.summary}</p> : null}
        <div className={styles.actions}>
          {data.liveUrl ? (
            <Button href={data.liveUrl} icon="arrow-up-right">
              {label('visitLiveSite')}
            </Button>
          ) : null}
          <Button href={site.resumePdf} variant="outline" icon="download" download>
            {label('downloadCv')}
          </Button>
        </div>
      </div>
      <CaseMeta slug={slug} locale={locale} className={styles.meta} />
    </Panel>
  );
}
