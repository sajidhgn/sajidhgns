/**
 * CaseFigure — one project screenshot with its caption (SPEC §5). Async server component.
 *
 * export default async function CaseFigure({ slug, figure, locale, priority = false, sizes, layout, className })
 *   slug      project slug
 *   figure    figure key from content/projects.js → figures (see FIGURES.md); unknown key → renders nothing
 *   locale    "en" | "ar"
 *   priority  next/image priority — only for the cover panel (the page's likely LCP)
 *   sizes     next/image sizes override (default: the panel content width, capped at the natural width)
 *   layout    'block' (default: full panel width; a phone screen sits beside its caption on wide screens)
 *             | 'aside' (half-width column, e.g. inside a decision card)
 *   className extra class on the <figure>
 *
 * Desktop screenshots sit in a BrowserFrame; full-page captures (taller than wide) get the fixed-height
 * scrollable frame; phone screens get a rounded device card; low-resolution images are never upscaled.
 * Caption: 13px --text-subtle, with a "Shown with test data" note where FIGURES.md marks test records.
 * Alt/caption: projects.items.<slug>.figures.<key>.{alt,caption}.
 */
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import cx from '../../ui/cx';
import Icon from '../../ui/Icon/Icon';
import BrowserFrame from '../BrowserFrame/BrowserFrame';
import { getCase, panelSizes } from '../caseContent';
import styles from './CaseFigure.module.scss';

/** Widest the panel content box gets (1280 container − 2·40 padding − 2 borders). */
const PANEL_MAX = 1198;
const DEVICE_WIDTH = { block: 300, aside: 240 };

export default async function CaseFigure({ slug, figure, locale, priority = false, sizes, layout = 'block', className }) {
  const data = await getCase(slug, locale);
  const fig = data?.figure(figure);
  if (!fig) return null;
  const t = await getTranslations({ locale, namespace: 'case' });
  const label = (key, values) => (t.has(key) ? t(key, values) : '');

  const testNote = fig.testData ? label('figure.testData') : '';
  // `width` aligns the caption with a frame that is narrower than the panel.
  const renderCaption = (width) =>
    fig.caption || testNote ? (
      <figcaption className={styles.caption} style={width ? { maxWidth: `${width + 2}px` } : undefined}>
        {testNote ? (
          <span className={styles.note}>
            <Icon name="database" size={12} className={styles.noteIcon} />
            {testNote}
          </span>
        ) : null}
        {fig.caption ? <span className={styles.captionText}>{fig.caption}</span> : null}
      </figcaption>
    ) : null;

  if (fig.kind === 'mobile') {
    const width = Math.min(DEVICE_WIDTH[layout] ?? DEVICE_WIDTH.block, fig.width);
    return (
      <figure className={cx(styles.figure, styles.mobile, styles[layout], className)}>
        <div className={styles.device} style={{ maxWidth: `${width}px` }}>
          <Image
            src={fig.src}
            width={fig.width}
            height={fig.height}
            alt={fig.alt}
            sizes={sizes ?? panelSizes(width)}
            quality={80}
            priority={priority}
            className={styles.deviceImage}
          />
        </div>
        {renderCaption()}
      </figure>
    );
  }

  // 1× captures narrower than the panel stay at their natural (visible) width instead of being upscaled.
  const visibleWidth = fig.width - fig.trim;
  const cap = layout === 'block' && visibleWidth < PANEL_MAX ? visibleWidth : undefined;
  const tall = fig.kind === 'page';

  return (
    <figure className={cx(styles.figure, styles[fig.kind], styles[layout], className)}>
      <BrowserFrame
        tall={tall}
        label={tall ? label('figure.scrollRegion', { name: fig.alt }) : undefined}
        hint={tall ? label('figure.scrollHint') : undefined}
        width={fig.width}
        trim={fig.trim}
        maxWidth={cap}
        compact={layout === 'aside'}
      >
        <Image
          src={fig.src}
          width={fig.width}
          height={fig.height}
          alt={fig.alt}
          sizes={sizes ?? panelSizes(cap)}
          quality={80}
          priority={priority}
        />
      </BrowserFrame>
      {renderCaption(cap)}
    </figure>
  );
}
