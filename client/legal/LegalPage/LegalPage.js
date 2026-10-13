/**
 * LegalPage — the body of /[locale]/privacy and /[locale]/terms (SPEC §5): a hero panel (eyebrow "LEGAL",
 * <h1>, intro, "Last updated" date, a switch between the two documents) and one reading panel (an
 * "On this page" list, sticky ≥ 1024px, then one <h2> section after another, text ≤ 720px wide).
 * Server component. Text comes from the server-only `legal` namespace (SCHEMA.md); emails and URLs in it
 * become links (RichText).
 *
 * export default async function LegalPage({ locale, doc })
 *   locale  "en" | "ar"
 *   doc     'privacy' | 'terms'
 *
 * export async function legalMetadata({ locale, doc })
 *   generateMetadata helper (lib/seo.js): meta.<doc>.title / .description when the meta namespace has them,
 *   otherwise "<legal title> · <site name>" and legal.<doc>.description.
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '../../../i18n/navigation';
import { buildMetadata } from '../../../lib/seo';
import { localeTag } from '../../../lib/i18n';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Icon from '../../ui/Icon/Icon';
import cx from '../../ui/cx';
import RichText from '../RichText/RichText';
import styles from './LegalPage.module.scss';

export const LEGAL_DOCS = ['privacy', 'terms'];

const pad = (value) => String(value).padStart(2, '0');

function formatDate(iso, locale) {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export async function legalMetadata({ locale, doc }) {
  const [t, meta] = await Promise.all([
    getTranslations({ locale, namespace: 'legal' }),
    getTranslations({ locale, namespace: 'meta' }),
  ]);
  const title = meta.has(`${doc}.title`) ? meta(`${doc}.title`) : `${t(`${doc}.title`)} · ${meta('siteName')}`;
  const description = meta.has(`${doc}.description`) ? meta(`${doc}.description`) : t(`${doc}.description`);
  return buildMetadata({ locale, path: `/${doc}`, title, description });
}

export default async function LegalPage({ locale, doc }) {
  const [t, tl] = await Promise.all([
    getTranslations({ locale, namespace: 'legal' }),
    getTranslations({ locale, namespace: 'layout' }),
  ]);
  const raw = t.raw(`${doc}.sections`);
  const sections = Array.isArray(raw) ? raw.filter((section) => section && section.heading) : [];
  const updated = t('updated');
  const newTab = tl('a11y.opensInNewTab');
  const sectionId = (index) => `${doc}-${index + 1}`;

  return (
    <article className="container bento" aria-labelledby="legal-title">
      <Panel as="header" className={styles.hero} glow>
        <span className={styles.badge} aria-hidden="true">
          <Icon name={doc === 'privacy' ? 'shield-check' : 'file-text'} size={22} />
        </span>
        <Eyebrow label={t('label')} />
        <h1 id="legal-title" className={styles.title}>
          {t(`${doc}.title`)}
        </h1>
        <p className={styles.intro}>{t(`${doc}.intro`)}</p>
        <div className={styles.meta}>
          <p className={styles.updated}>
            <Icon name="calendar" size={16} className={styles.updatedIcon} />
            <span>
              {t('updatedLabel')}: <time dateTime={updated}>{formatDate(updated, locale)}</time>
            </span>
          </p>
          <nav aria-label={t('documents')}>
            <ul className={styles.docs} role="list">
              {LEGAL_DOCS.map((key) => (
                <li key={key}>
                  <Link href={`/${key}`} className={styles.doc} aria-current={key === doc ? 'page' : undefined}>
                    {t(`${key}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Panel>

      <Panel as="div" className={styles.reading}>
        {sections.length > 1 ? (
          <nav className={styles.toc} aria-labelledby={`${doc}-toc`}>
            <p id={`${doc}-toc`} className={styles.tocTitle}>
              {t('onThisPage')}
            </p>
            <ol className={styles.tocList} role="list">
              {sections.map((section, index) => (
                <li key={sectionId(index)}>
                  <a href={`#${sectionId(index)}`} className={styles.tocLink}>
                    <span className={styles.tocNum} aria-hidden="true">
                      {pad(index + 1)}
                    </span>
                    <span>{section.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className={cx(styles.text)}>
          {sections.map((section, index) => (
            <section key={sectionId(index)} id={sectionId(index)} className={styles.section}>
              <h2 className={styles.heading}>
                <span className={styles.num} aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <span>{section.heading}</span>
              </h2>
              {(Array.isArray(section.body) ? section.body : []).map((paragraph, i) => (
                <p key={i} className={styles.paragraph}>
                  <RichText text={paragraph} newTabLabel={newTab} />
                </p>
              ))}
            </section>
          ))}
        </div>
      </Panel>
    </article>
  );
}
