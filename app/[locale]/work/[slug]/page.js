/**
 * /[locale]/work/[slug] — a case study (SPEC §5), statically generated for every slug × locale.
 * Unknown slugs 404 (dynamicParams = false); legacy /[locale]/project/<id> URLs 308 here.
 *
 * Panels, in order: CaseHero (h1, details) → CaseCover (screenshot) → CaseTldr ("01 At a glance") →
 * CaseBlocks (narrative, eyebrows numbered from 02) → [CaseNext | CaseCta] side by side on wide screens,
 * numbered after the last block (every eyebrow carries its number, SPEC §3).
 */
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getProject, projectSlugs } from '../../../../content/projects';
import { buildMetadata } from '../../../../lib/seo';
import { getCase } from '../../../../client/case-study/caseContent';
import CaseHero from '../../../../client/case-study/CaseHero/CaseHero';
import CaseCover from '../../../../client/case-study/CaseCover/CaseCover';
import CaseTldr from '../../../../client/case-study/CaseTldr/CaseTldr';
import CaseBlocks from '../../../../client/case-study/CaseBlocks/CaseBlocks';
import CaseNext from '../../../../client/case-study/CaseNext/CaseNext';
import CaseCta from '../../../../client/case-study/CaseCta/CaseCta';
import Reveal from '../../../../client/ui/Reveal/Reveal';
import JsonLd from '../../../../client/seo/JsonLd/JsonLd';
import styles from './page.module.scss';

export const dynamicParams = false;

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params: { locale, slug } }) {
  if (!getProject(slug)) return {};
  const [data, meta] = await Promise.all([getCase(slug, locale), getTranslations({ locale, namespace: 'meta' })]);
  const description = data.summary || (meta.has('work.descriptionFallback') ? meta('work.descriptionFallback') : '');
  const title = meta.has('work.titleTemplate') ? meta('work.titleTemplate', { title: data.title }) : data.title;
  const cover = data.figure('cover');

  return buildMetadata({
    locale,
    path: `/work/${slug}`,
    title,
    description,
    type: 'article',
    image: cover ? { url: cover.src, width: cover.width, height: cover.height, alt: cover.alt } : undefined,
  });
}

export default async function CaseStudyPage({ params: { locale, slug } }) {
  setRequestLocale(locale);
  if (!getProject(slug)) notFound();
  const { closingNumbers } = await getCase(slug, locale);

  return (
    <>
      <JsonLd kind="case" slug={slug} locale={locale} />
      <div className="container bento">
        <CaseHero slug={slug} locale={locale} />
        <CaseCover slug={slug} locale={locale} />
        <CaseTldr slug={slug} locale={locale} />
        <CaseBlocks slug={slug} locale={locale} />
        <div className={styles.closing}>
          <Reveal className={styles.cell}>
            <CaseNext slug={slug} locale={locale} number={closingNumbers.next} />
          </Reveal>
          <Reveal className={styles.cell} delay={60}>
            <CaseCta locale={locale} number={closingNumbers.contact} />
          </Reveal>
        </div>
      </div>
    </>
  );
}
