/**
 * /[locale]/work — all projects (SPEC §5). Static for every locale (the [locale] layout provides
 * generateStaticParams). Body: client/work/WorkIndex.
 *
 * Metadata: meta.workIndex.{title, description} when the meta namespace has them; otherwise
 * "<home.projects.pageTitle> · <meta.siteName>" and home.projects.pageIntro.
 */
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import { buildMetadata } from '../../../lib/seo';
import WorkIndex from '../../../client/work/WorkIndex/WorkIndex';

export async function generateMetadata({ params: { locale } }) {
  if (!routing.locales.includes(locale)) return {};
  const home = await getTranslations({ locale, namespace: 'home' });
  const meta = await getTranslations({ locale, namespace: 'meta' });
  const pick = (t, key, fallback = '') => (t.has(key) ? t(key) : fallback);

  const siteName = pick(meta, 'siteName', 'Sajid Ali');
  const pageTitle = pick(home, 'projects.pageTitle', 'Selected work');
  const title = pick(meta, 'workIndex.title', `${pageTitle} · ${siteName}`);
  const description = pick(meta, 'workIndex.description', pick(home, 'projects.pageIntro'));

  return buildMetadata({ locale, path: '/work', title, description });
}

export default function WorkPage({ params: { locale } }) {
  setRequestLocale(locale);
  return (
    <div className="container bento">
      <WorkIndex locale={locale} />
    </div>
  );
}
