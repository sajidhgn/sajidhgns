/**
 * CaseCover — the screenshot panel under the case hero (SPEC §5 (2)). Async server component.
 *
 * export default async function CaseCover({ slug, locale })
 *   slug    project slug
 *   locale  "en" | "ar"
 *
 * Shows the project's full-page capture (`figures.full`) when it has one — tall captures sit in a
 * fixed-height, keyboard-scrollable BrowserFrame — otherwise the cover crop, in full. This image is the
 * page's likely LCP, so it gets `priority`; it is never wrapped in Reveal. Nothing to show → no panel.
 */
import Panel from '../../ui/Panel/Panel';
import CaseFigure from '../CaseFigure/CaseFigure';
import { getCase } from '../caseContent';
import styles from './CaseCover.module.scss';

export default async function CaseCover({ slug, locale }) {
  const data = await getCase(slug, locale);
  if (!data?.figure(data.heroKey)) return null;

  return (
    <Panel as="div" className={styles.cover}>
      <CaseFigure slug={slug} locale={locale} figure={data.heroKey} priority />
    </Panel>
  );
}
