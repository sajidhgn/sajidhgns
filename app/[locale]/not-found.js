/**
 * 404 inside the [locale] layout (SPEC §5): one panel — eyebrow "404 · Error", <h1> "Page not found", a line of
 * text, Primary "Back to home" + Outline "View case studies" — with the hero's gold ring as decoration.
 *
 * Rendered for notFound() calls (unknown slugs / ids) and, via app/[locale]/[...rest], for unknown paths.
 * not-found.js receives no params: next-intl takes the locale set by the layout (setRequestLocale), and
 * i18n/request.js falls back to the default locale when there is none.
 * Next 14 has no metadata exports for not-found.js, so the document title is set with a <title> element
 * (React hoists it into <head>); Next already adds <meta name="robots" content="noindex">.
 */
import { getTranslations } from 'next-intl/server';
import Panel from '../../client/ui/Panel/Panel';
import Eyebrow from '../../client/ui/Eyebrow/Eyebrow';
import Button from '../../client/ui/Button/Button';
import styles from './not-found.module.scss';

export default async function NotFound() {
  const [t, meta] = await Promise.all([getTranslations('layout'), getTranslations('meta')]);
  const title = meta.has('notFound.title') ? meta('notFound.title') : t('notFound.metaTitle');

  return (
    <div className="container bento">
      <title>{title}</title>
      <Panel className={styles.panel} labelledBy="not-found-title" glow>
        <div className={styles.copy}>
          <Eyebrow number={t('notFound.code')} label={t('notFound.eyebrow')} />
          <h1 id="not-found-title" className={styles.title}>
            {t('notFound.title')}
          </h1>
          <p className={styles.body}>{t('notFound.body')}</p>
          <div className={styles.actions}>
            <Button href="/" icon="arrow-left" iconPosition="start">
              {t('notFound.home')}
            </Button>
            <Button href="/work" variant="outline" icon="grid-2x2">
              {t('notFound.work')}
            </Button>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <span className={styles.halo} />
          <span className={styles.orbit} />
          <span className={styles.ring} />
          <span className={styles.code} dir="ltr">
            {t('notFound.code')}
          </span>
          <span className={styles.spark} style={{ '--x': '18%', '--y': '22%' }} />
          <span className={styles.spark} style={{ '--x': '84%', '--y': '30%' }} />
          <span className={styles.spark} style={{ '--x': '74%', '--y': '82%' }} />
          <span className={styles.spark} style={{ '--x': '10%', '--y': '70%' }} />
        </div>
      </Panel>
    </div>
  );
}
