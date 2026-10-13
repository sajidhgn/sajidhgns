/**
 * Experience — the "05 EXPERIENCE" panel (SPEC §4.5, reference crop e_experience.jpg). Server component.
 *
 * export default async function Experience({ locale, number })
 *   locale  "en" | "ar"
 *   number  eyebrow number ("05") — computed by app/[locale]/page.js from the rendered order
 *
 * Data: content/experience.js (newest first: company, logo, url, start/end) + messages
 * experience.roles.<id>.{title, summary} (REAL titles, never changed here) + home.experience.{label, present}.
 * Dates come from lib/i18n.js (localised month names, Latin digits in Arabic); an empty end date shows
 * home.experience.present.
 *
 * Layout: a horizontally scrolling timeline at every width. The 1px gold line is fixed across the panel; the
 * fixed-width columns (each with its glowing dot) scroll and snap along it. Each column is [white 48px logo
 * tile] + [title, company, dates, summary] side by side. Prev / next arrows (TestimonialsNav, labels
 * home.experience.{prev, next}) sit at the header's inline-end; touch, trackpad and arrow keys also scroll.
 * The scrollbar is hidden.
 *
 * Logos are decorative (alt=""): the company name is right next to them as text.
 * Empty or "TODO…" placeholder summaries are not rendered (CONTRACT §0.1 — the slot hides).
 */
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { roles } from '../../../content/experience';
import { formatMonthYear } from '../../../lib/i18n';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Reveal from '../../ui/Reveal/Reveal';
import cx from '../../ui/cx';
import TestimonialsNav from '../Testimonials/TestimonialsNav';
import styles from './Experience.module.scss';

// /images/work/5.jpeg (Teambee Designers) carries its own dark background, so it fills its tile instead of
// sitting on white with a padding (content/experience.js notes the dark background).
const FULL_BLEED_LOGOS = new Set(['/images/work/5.jpeg']);

const TRACK_ID = 'experience-track';
const LOGO_SIZE = 48;
const LOGO_INNER = 36; // 48px tile − 2 × 6px padding

/** A real, displayable string: not empty and not a "TODO: …" content placeholder. */
const isFilled = (value) => typeof value === 'string' && value.trim() !== '' && !/^TODO\b/i.test(value.trim());

export default async function Experience({ locale, number }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const te = await getTranslations({ locale, namespace: 'experience' });
  const tl = await getTranslations({ locale, namespace: 'layout' });

  const present = t.has('experience.present') ? t('experience.present') : 'Present';
  const newTab = tl.has('a11y.opensInNewTab') ? tl('a11y.opensInNewTab') : '(opens in a new tab)';
  const text = (key) => (te.has(key) ? te(key) : '');

  const items = roles
    .map((role) => ({ ...role, title: text(`roles.${role.id}.title`), summary: text(`roles.${role.id}.summary`) }))
    .filter((role) => isFilled(role.title));

  if (items.length === 0) return null;

  return (
    <Panel id="experience" labelledBy="experience-title">
      <div className={styles.header}>
        <Eyebrow as="h2" id="experience-title" number={number} label={t('experience.label')} />
        <TestimonialsNav
          trackId={TRACK_ID}
          prevLabel={t.has('experience.prev') ? t('experience.prev') : 'Previous roles'}
          nextLabel={t.has('experience.next') ? t('experience.next') : 'Next roles'}
        />
      </div>
      <div className={styles.timeline}>
        {/* The line stays still; the roles (and their dots) scroll along it. */}
        <span className={styles.line} aria-hidden="true" />
        {/* Focusable so keyboard users can scroll it with the arrow keys. */}
        <ol id={TRACK_ID} role="list" className={styles.list} aria-labelledby="experience-title" tabIndex={0}>
          {items.map((role, index) => {
            const fullBleed = FULL_BLEED_LOGOS.has(role.logo);
            const size = fullBleed ? LOGO_SIZE : LOGO_INNER;
            return (
              <li key={role.id} className={styles.item}>
                {/* The dot stays put on the still line; only the card content fades up. */}
                <span className={styles.dot} aria-hidden="true" />
                <Reveal className={styles.content} delay={index * 60}>
                  <span className={cx(styles.logo, fullBleed && styles.logoFull)}>
                    {role.logo ? (
                      <Image src={role.logo} alt="" width={size} height={size} className={styles.logoImg} />
                    ) : null}
                  </span>
                  <div className={styles.body}>
                    {/* <bdi>: the real titles are English — keeps "(Frontend Focused)" in order inside Arabic. */}
                    <h3 className={styles.title}>
                      <bdi>{role.title}</bdi>
                    </h3>
                    <p className={styles.company}>
                      {role.url ? (
                        <a className={styles.companyLink} href={role.url} target="_blank" rel="noopener noreferrer">
                          <bdi>{role.company}</bdi>
                          <span className="visually-hidden"> {newTab}</span>
                        </a>
                      ) : (
                        <bdi>{role.company}</bdi>
                      )}
                    </p>
                    <p className={styles.dates}>
                      <time dateTime={role.start}>{formatMonthYear(role.start, locale)}</time>
                      {' – '}
                      {role.end ? <time dateTime={role.end}>{formatMonthYear(role.end, locale)}</time> : present}
                    </p>
                    {isFilled(role.summary) ? <p className={styles.summary}>{role.summary}</p> : null}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Panel>
  );
}
