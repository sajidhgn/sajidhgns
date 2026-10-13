/**
 * /[locale]/resume — the résumé in the page language (SPEC §5): a dark, panel-styled document on screen with
 * "Download PDF" (site.resumePdf) and "Print"; a white, single-column A4 document in print.
 * Static for every locale (the [locale] layout provides generateStaticParams).
 */
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '../../../lib/seo';
import ResumeDocument from '../../../client/resume/ResumeDocument/ResumeDocument';
import JsonLd from '../../../client/seo/JsonLd/JsonLd';
import { ogImage } from '../../../client/seo/ogImage';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return buildMetadata({
    locale,
    path: '/resume',
    title: t('resume.title'),
    description: t('resume.description'),
    type: 'profile',
    image: ogImage(locale),
  });
}

export default function ResumePage({ params: { locale } }) {
  setRequestLocale(locale);
  return (
    <>
      <JsonLd kind="person" locale={locale} />
      <ResumeDocument locale={locale} />
    </>
  );
}
