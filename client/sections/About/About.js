/**
 * About — panel #about (SPEC §4.2). Server component.
 *
 * export default async function About({ locale, number })
 *   locale  "en" | "ar"
 *   number  eyebrow number ("01") — computed by app/[locale]/page.js from the rendered order
 *
 * No photo here on purpose: the hero already carries the portrait.
 *   Eyebrow as <p> → <h2> heading segments (gold accent word) → paragraphs (home.about.body: a string or an
 *   array of paragraphs; the first one reads brighter as the lead; "{years}" = yearsOfExperience())
 *   → fact chips (home.about.facts: location, Iqama, work modes, degree)
 *   → Outline "Download CV" (site.resumePdf, `download`) with the decorative "Sajid" signature in --font-script
 *     (aria-hidden) as a sign-off.
 * Messages: home.about.* (SCHEMA.md).
 */
import { getTranslations } from 'next-intl/server';
import { site } from '../../../content/site';
import { yearsOfExperience } from '../../../lib/site';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Segments from '../../ui/Segments/Segments';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import Reveal from '../../ui/Reveal/Reveal';
import styles from './About.module.scss';

// One gold line icon per fact chip, by id.
const FACT_ICONS = { location: 'map-pin', iqama: 'shield-check', workModes: 'monitor', education: 'award' };

const list = (t, key) => (t.has(key) && Array.isArray(t.raw(key)) ? t.raw(key) : []);

export default async function About({ locale, number }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const text = (key) => (t.has(key) ? t(key) : '');
  const raw = t.has('about.body') ? t.raw('about.body') : '';
  const years = String(yearsOfExperience());
  const paragraphs = (Array.isArray(raw) ? raw : [raw])
    .filter((paragraph) => typeof paragraph === 'string' && paragraph.trim())
    .map((paragraph) => paragraph.replace('{years}', years));
  const facts = list(t, 'about.facts').filter((fact) => fact?.text);
  const signature = text('about.signature');

  return (
    <Panel id="about" className={styles.panel} labelledBy="about-title">
      <Reveal className={styles.intro}>
        <Eyebrow number={number} label={text('about.label')} />
        <h2 id="about-title" className={styles.title}>
          <Segments segments={t.has('about.heading') ? t.raw('about.heading') : ''} />
        </h2>
        {paragraphs.length ? (
          <div className={styles.body}>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}
      </Reveal>

      <Reveal className={styles.footer} delay={60}>
        {facts.length ? (
          <ul className={styles.facts} role="list">
            {facts.map((fact) => (
              <li key={fact.id ?? fact.text} className={styles.fact}>
                <Icon name={FACT_ICONS[fact.id] ?? 'check-circle'} size={14} className={styles.factIcon} />
                {fact.text}
              </li>
            ))}
          </ul>
        ) : null}

        <div className={styles.actions}>
          {text('about.cta') ? (
            <Button href={site.resumePdf} download variant="outline" icon="download" className={styles.cta}>
              {text('about.cta')}
            </Button>
          ) : null}
          {signature ? (
            <span className={styles.signature} aria-hidden="true" lang="en" dir="ltr" translate="no">
              {signature}
            </span>
          ) : null}
        </div>
      </Reveal>
    </Panel>
  );
}
