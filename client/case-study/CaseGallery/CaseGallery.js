/**
 * CaseGallery — gallery block body: 3-column thumbnails that open an accessible <dialog> viewer
 * (SPEC §5). Async server component; the interactive part is the CaseLightbox client island.
 *
 * export default async function CaseGallery({ slug, figures, locale, title })
 *   slug     project slug
 *   figures  figure keys (the gallery block's `figures`); unknown keys are skipped, none left → nothing
 *   locale   "en" | "ar"
 *   title    gallery name for the viewer's accessible name (defaults to the project title)
 *
 * The panel, eyebrow and heading come from CaseBlocks. Figure alt/caption: projects.items.<slug>.figures.
 */
import { getCase } from '../caseContent';
import CaseLightbox from '../CaseLightbox/CaseLightbox';

// 3 columns ≥ 1024px (16px gaps), 2 columns below (12px gap) — panel content widths from caseContent.
const THUMB_SIZES =
  '(min-width: 1392px) 389px, (min-width: 1024px) calc((92vw - 114px) / 3), (min-width: 640px) calc((92vw - 62px) / 2), (min-width: 400px) calc((92vw - 54px) / 2), calc((100vw - 86px) / 2)';

export default async function CaseGallery({ slug, figures = [], locale, title }) {
  const data = await getCase(slug, locale);
  if (!data || !Array.isArray(figures)) return null;

  const items = figures
    .map((key) => data.figure(key))
    .filter(Boolean)
    .map(({ key, src, width, height, alt, caption, testData, kind, lowRes }) => ({
      key,
      src,
      width,
      height,
      alt,
      caption,
      testData,
      kind,
      lowRes,
    }));
  if (!items.length) return null;

  return <CaseLightbox items={items} title={title || data.title} sizes={THUMB_SIZES} />;
}
