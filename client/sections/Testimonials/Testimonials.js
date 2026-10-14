/**
 * Testimonials — the "TESTIMONIALS" panel (SPEC §4.6, reference crop f_testimonials.jpg). Server component.
 *
 * export default async function Testimonials({ locale, number, items })
 *   locale  "en" | "ar"
 *   number  eyebrow number ("06") — computed by app/[locale]/page.js from the rendered order
 *   items   optional override of home.testimonials.items, for layout previews only (the page never passes it)
 *
 * REAL entries only (CONTRACT §0.1, SPEC allowed deviation 3): home.testimonials.items is empty today, so this
 * returns null and the page (which checks the same list) never renders it or its nav item.
 * Item shape (SCHEMA.md): { quote, name, role, company, avatar: "/images/…" | "", rating: 1–5 | null,
 * source: "LinkedIn recommendation", url: "" }. Entries without a quote or a name are skipped.
 *
 * Cards: <figure><blockquote>…</blockquote><figcaption>…</figcaption></figure> — gold quote mark, quote,
 * avatar (photo, or a monogram when there is none), name, role · company, the source (a link when `url`
 * is set) and gold stars ONLY when a rating is set. Three columns; with more than three entries the row
 * becomes a scroll-snap track (keyboard-scrollable) and the prev/next buttons appear (TestimonialsNav).
 */
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Icon from '../../ui/Icon/Icon';
import Reveal from '../../ui/Reveal/Reveal';
import cx from '../../ui/cx';
import TestimonialsNav from './TestimonialsNav';
import styles from './Testimonials.module.scss';

const TRACK_ID = 'testimonials-track';
const STARS = [1, 2, 3, 4, 5];

const isText = (value) => typeof value === 'string' && value.trim() !== '';

/** 1–5 (rounded), or null when the entry has no rating. */
function ratingOf(value) {
  const rating = Number(value);
  return value != null && Number.isFinite(rating) && rating > 0 ? Math.min(5, Math.round(rating)) : null;
}

/** "Sarah Johnson" → "SJ" (decorative monogram when there is no photo). */
function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? '')
    .join('')
    .toUpperCase();
}

export default async function Testimonials({ locale, number, items: override }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const tc = await getTranslations({ locale, namespace: 'contact' });
  const tl = await getTranslations({ locale, namespace: 'layout' });

  const raw = override ?? (t.has('testimonials.items') ? t.raw('testimonials.items') : []);
  const items = (Array.isArray(raw) ? raw : []).filter((item) => item && isText(item.quote) && isText(item.name));
  if (items.length === 0) return null;

  const label = t.has('testimonials.label') ? t('testimonials.label') : 'Testimonials';
  const newTab = tl.has('a11y.opensInNewTab') ? tl('a11y.opensInNewTab') : '(opens in a new tab)';
  const scrollable = items.length > 3;
  const separator = locale === 'ar' ? '، ' : ', ';

  return (
    <Panel id="testimonials" labelledBy="testimonials-title">
      <div className={styles.header}>
        <Eyebrow as="h2" id="testimonials-title" number={number} label={label} />
        {scrollable ? (
          <TestimonialsNav
            trackId={TRACK_ID}
            prevLabel={t.has('testimonials.prev') ? t('testimonials.prev') : 'Previous testimonials'}
            nextLabel={t.has('testimonials.next') ? t('testimonials.next') : 'Next testimonials'}
          />
        ) : null}
      </div>

      <ul
        id={TRACK_ID}
        role="list"
        className={cx(styles.track, scrollable && styles.scroller)}
        // A scrolling row must be reachable by keyboard (arrow keys scroll it once focused).
        tabIndex={scrollable ? 0 : undefined}
        aria-label={scrollable ? label : undefined}
      >
        {items.map((item, index) => {
          const rating = ratingOf(item.rating);
          const role = [item.role, item.company].filter(isText).join(separator);
          const source = isText(item.source) ? item.source : tc('testimonials.sourceFallback');
          return (
            <Reveal as="li" key={`${item.name}-${index}`} className={styles.slide} delay={(index % 3) * 60}>
              <figure className={styles.card}>
                <blockquote className={styles.quote}>
                  <p>
                    <Icon name="quote" size={24} flip className={styles.mark} />
                    {/* <bdi>: a quote keeps its own direction (an English quote on the Arabic page stays in order). */}
                    <bdi>{item.quote}</bdi>
                  </p>
                </blockquote>
                <figcaption className={styles.caption}>
                  {isText(item.avatar) ? (
                    <Image src={item.avatar} alt={item.name} title={item.name} width={48} height={48} className={styles.avatar} />
                  ) : (
                    <span className={cx(styles.avatar, styles.monogram)} aria-hidden="true">
                      {initials(item.name)}
                    </span>
                  )}
                  <span className={styles.who}>
                    <span className={styles.name}>
                      <bdi>{item.name}</bdi>
                    </span>
                    {role ? (
                      <span className={styles.role}>
                        <bdi>{role}</bdi>
                      </span>
                    ) : null}
                    {isText(item.url) ? (
                      <a className={styles.source} href={item.url} title={`${source} — ${item.name}`} target="_blank" rel="noopener noreferrer">
                        {source}
                        <span className="visually-hidden"> {newTab}</span>
                      </a>
                    ) : isText(item.source) ? (
                      <span className={styles.sourceText}>{item.source}</span>
                    ) : null}
                  </span>
                  {rating ? (
                    <span className={styles.rating}>
                      <span className="visually-hidden">{tc('testimonials.rating', { rating })}</span>
                      <span className={styles.stars} aria-hidden="true">
                        {STARS.map((star) => (
                          <Icon key={star} name="star" size={13} className={cx(styles.star, star > rating && styles.starOff)} />
                        ))}
                      </span>
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </ul>
    </Panel>
  );
}
