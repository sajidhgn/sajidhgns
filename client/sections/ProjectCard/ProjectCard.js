/**
 * ProjectCard — the reference's project card (SPEC §4.4). Async server component, reused by the home
 * Projects panel, /work (WorkIndex) and the case study's next-project panel.
 *
 * export default async function ProjectCard({ slug, locale, headingLevel = 'h3', size = 'md', priority = false, sizes })
 *   slug          project slug from content/projects.js — unknown slug → renders nothing
 *   locale        "en" | "ar"
 *   headingLevel  'h2' | 'h3' | 'h4' — the title's heading tag (h3 inside a section panel)
 *   size          'md' (default; the reference card: stack chip, title, 2-line summary) |
 *                 'lg' (/work featured grid: larger title, category line, headline instead of the summary)
 *   priority      true → next/image `priority` for a cover that is the page's LCP (the first /work cards;
 *                 the home page keeps priority for the hero portrait only)
 *   sizes         optional next/image `sizes` override for a card rendered at another width than the
 *                 home / work grids (e.g. a single card in a wider panel); default: the grid widths below
 *
 * <article>: cover (aspect 16/7.2, object-fit cover, top-aligned; 1px bottom rule) → stack chip (first 3
 * stack items joined by " • "; read as "Stack: React, Next.js, Node.js") → title → summary (lg: category +
 * headline), with a 44px icon button at the inline end, bottom-aligned. The title link is stretched over
 * the whole card (→ /work/<slug>); the icon button is its own link above it: the live site when liveUrl
 * exists ("Visit the HealthSIA live site (opens in new tab)"), otherwise the case study ("Read the HealthSIA
 * case study"). The cover is decorative (alt=""): the title names the project and the case study describes
 * the screens.
 * A card wider than 600px (the odd last card spanning a 2-column row) switches to image | text (container
 * query, ProjectCard.module.scss).
 * Text: projects.items.<slug>.{title, summary, headline, category}; labels: work.{stack, visitLiveAria,
 * readCaseAria}. Empty strings hide their slot.
 */
import { Fragment } from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { getProject } from '../../../content/projects';
import { Link } from '../../../i18n/navigation';
import Button from '../../ui/Button/Button';
import cx from '../../ui/cx';
import styles from './ProjectCard.module.scss';

// Card covers that differ from content/projects.js `cover` (a project's own `cardCover`, if one is ever
// registered there, wins). HealthSIA's dark dashboard crop matches the reference's dark cards; its light
// cover stays the case-study cover. Width/height are the file's real pixel size (read with sharp).
const CARD_COVERS = {
  healthsia: { src: '/images/project/covers/healthsia-dark.jpg', width: 1600, height: 943, position: 'left top' },
};

// Rendered card width (container min(1280px, 100vw − 2 × 4vw), panel padding 40/24/20, grid gaps 23px):
// md 3 columns ≥ 1100 (384px at ≥ 1391), 2 columns ≥ 700, 1 column below; lg 2 columns ≥ 700 (588px max).
const SIZES = {
  md: '(min-width: 1391px) 384px, (min-width: 1100px) calc(30.7vw - 43px), (min-width: 700px) calc(46vw - 36px), calc(92vw - 50px)',
  lg: '(min-width: 1391px) 588px, (min-width: 700px) calc(46vw - 37px), calc(92vw - 50px)',
};

const HEADINGS = new Set(['h2', 'h3', 'h4']);

export default async function ProjectCard({ slug, locale, headingLevel = 'h3', size = 'md', priority = false, sizes }) {
  const project = getProject(slug);
  if (!project) return null;

  const t = await getTranslations({ locale, namespace: 'projects' });
  const tw = await getTranslations({ locale, namespace: 'work' });
  // Content strings are read raw (no ICU parsing); anything that is not a non-empty string is hidden.
  const field = (key) => {
    const path = `items.${slug}.${key}`;
    const value = t.has(path) ? t.raw(path) : '';
    return typeof value === 'string' ? value.trim() : '';
  };
  const label = (key, values, fallback) => (tw.has(key) ? tw(key, values) : fallback);

  const lg = size === 'lg';
  const Heading = HEADINGS.has(headingLevel) ? headingLevel : 'h3';
  const title = field('title') || slug;
  const description = lg ? field('headline') || field('summary') : field('summary');
  const category = lg ? field('category') : '';
  const cover = project.cardCover ?? CARD_COVERS[slug] ?? project.cover;
  const tags = (project.stack ?? []).slice(0, 3);
  const liveUrl = project.liveUrl || '';
  const href = `/work/${slug}`;

  return (
    <article className={cx(styles.card, lg && styles.lg)}>
      <div className={styles.inner}>
        <div className={styles.media}>
          {cover ? (
            <Image
              src={cover.src}
              width={cover.width}
              height={cover.height}
              alt=""
              sizes={sizes || SIZES[lg ? 'lg' : 'md']}
              priority={priority}
              className={styles.image}
              style={{ objectPosition: cover.position || 'top' }}
            />
          ) : null}
        </div>
        <div className={styles.body}>
          {tags.length ? (
            <p className={styles.tags}>
              <span className="visually-hidden">{label('stack', undefined, 'Stack')}: </span>
              <bdi dir="ltr">
                {tags.map((tag, index) => (
                  <Fragment key={tag}>
                    {index ? (
                      <>
                        <span aria-hidden="true" className={styles.sep}>
                          {' • '}
                        </span>
                        <span className="visually-hidden">, </span>
                      </>
                    ) : null}
                    {tag}
                  </Fragment>
                ))}
              </bdi>
            </p>
          ) : null}
          <Heading className={styles.title}>
            <Link href={href} className={cx('stretched-link', styles.titleLink)}>
              {title}
            </Link>
          </Heading>
          <div className={styles.foot}>
            {category || description ? (
              <div className={styles.text}>
                {category ? <p className={styles.category}>{category}</p> : null}
                {description ? <p className={styles.summary}>{description}</p> : null}
              </div>
            ) : null}
            <Button
              variant="icon"
              href={liveUrl || href}
              icon={liveUrl ? 'external-link' : 'arrow-up-right'}
              ariaLabel={
                liveUrl
                  ? label('visitLiveAria', { title }, `Visit the ${title} live site`)
                  : label('readCaseAria', { title }, `Read the ${title} case study`)
              }
              className={styles.action}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
