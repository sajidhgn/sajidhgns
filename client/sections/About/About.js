/**
 * About — panel #about (SPEC §4.2). Server component.
 *
 * export default async function About({ locale, number })
 *   locale  "en" | "ar"
 *   number  eyebrow number ("01") — computed by app/[locale]/page.js from the rendered order
 *
 * Photo card (site.portrait, with the decorative "Sajid" signature in --font-script: aria-hidden, the photo has
 * its own alt) | Eyebrow as <p> → <h2> heading segments (gold accent word) → paragraph → 3 points with gold line
 * icons → Outline "Download CV" (site.resumePdf, `download`).
 * Layout follows the panel's own width (container query): photo beside the text when the panel is wide enough,
 * stacked above it otherwise.
 * Messages: home.about.* (SCHEMA.md).
 */
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { site } from '../../../content/site';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Segments from '../../ui/Segments/Segments';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import Reveal from '../../ui/Reveal/Reveal';
import styles from './About.module.scss';

// Solid placeholder in the photo's warm backdrop colour while it loads (the card never flashes empty).
const PHOTO_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxIDEnPjxyZWN0IHdpZHRoPScxJyBoZWlnaHQ9JzEnIGZpbGw9JyMyNDFmMTknLz48L3N2Zz4=';

// One gold line icon per point, in order: user-centred UX, design systems, fast front ends.
const POINT_ICONS = ['users', 'layers', 'zap'];

const list = (t, key) => (t.has(key) && Array.isArray(t.raw(key)) ? t.raw(key) : []);

export default async function About({ locale, number }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const text = (key) => (t.has(key) ? t(key) : '');
  const points = list(t, 'about.points').filter(Boolean).slice(0, 3);
  const signature = text('about.signature');

  return (
    <Panel id="about" className={styles.panel} labelledBy="about-title">
      <div className={styles.layout}>
        <Reveal className={styles.photo}>
          <Image
            src={site.portrait.src}
            width={site.portrait.width}
            height={site.portrait.height}
            alt={text('about.photoAlt')}
            sizes="(min-width: 640px) 276px, calc(100vw - 68px)"
            placeholder="blur"
            blurDataURL={PHOTO_PLACEHOLDER}
            className={styles.photoImg}
          />
          {signature ? (
            <span className={styles.signature} aria-hidden="true" lang="en" dir="ltr" translate="no">
              {signature}
            </span>
          ) : null}
        </Reveal>

        <Reveal className={styles.content} delay={60}>
          <Eyebrow number={number} label={text('about.label')} />
          <h2 id="about-title" className={styles.title}>
            <Segments segments={t.has('about.heading') ? t.raw('about.heading') : ''} />
          </h2>
          {text('about.body') ? <p className={styles.body}>{text('about.body')}</p> : null}
          {points.length ? (
            <ul className={styles.points} role="list">
              {points.map((point, index) => (
                <li key={index} className={styles.point}>
                  <Icon name={POINT_ICONS[index] ?? 'check-circle'} size={16} className={styles.pointIcon} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {text('about.cta') ? (
            <Button href={site.resumePdf} download variant="outline" icon="download" className={styles.cta}>
              {text('about.cta')}
            </Button>
          ) : null}
        </Reveal>
      </div>
    </Panel>
  );
}
