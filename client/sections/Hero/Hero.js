/**
 * Hero — panel #home with the page's only <h1> (SPEC §4.1). Server component.
 *
 * export default async function Hero({ locale })
 *   locale  "en" | "ar"
 *
 * Left: availability badge → headline segments (gold accent word) → summary → Hire Me (#contact) +
 * View My Work (#projects) → "Follow me on" + GitHub / LinkedIn / WhatsApp / Email.
 * Right (inline-end; it moves to the left in Arabic): the reference's portrait visual — a warm glow, a diagonal
 * light streak, a faint outer circle, the glowing gold ring with the head rising above it (and above the panel's
 * top edge, as in the reference), two tilted orbit ellipses with glowing dots and sparkles — pure CSS/SVG,
 * aria-hidden, no canvas, no JS. Decorations mirror in RTL; the photo does not. The glass stats card overlaps
 * the bottom of the portrait (static values; "{years}" = yearsOfExperience() from lib/site.js).
 *
 * The portrait (site.cutout, transparent PNG) is the LCP image → next/image `priority`. Never wrap the hero
 * in Reveal: it must paint instantly.
 * Messages: home.hero.* (SCHEMA.md); layout.footer.* for the social names, layout.a11y.opensInNewTab.
 */
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { site } from '../../../content/site';
import { yearsOfExperience } from '../../../lib/site';
import Panel from '../../ui/Panel/Panel';
import Badge from '../../ui/Badge/Badge';
import Segments from '../../ui/Segments/Segments';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import styles from './Hero.module.scss';

// Gold line icon per stat id (the reference's tiles: experience, projects, clients).
const STAT_ICONS = { years: 'briefcase', projects: 'grid-2x2', industries: 'globe' };

// The diagonal light streak, traced on the reference (ridge lines, in reference px from the ring centre): a ray
// rising ≈ 29° from the lower left into the left shoulder, a brighter one leaving the neck at ≈ 34° for the
// top-right corner (peaking just right of the neck, fading out by the panel edge: +74 L → +25 → +12), and a
// faint echo below it. Their middle runs behind the portrait.
// Two sets: "wide" (≥ 640px) ends at the panel edge (≈ ±400), "narrow" (phones) at ≈ ±275, so no decorative box
// ever pokes past the viewport.
// layers: [name, stroke width, opacity, blur]; stops: [offset, opacity] along the ray.
const LEFT_LAYERS = [['halo', 90, 0.16, 'xl'], ['band', 34, 0.24, 'lg'], ['core', 10, 0.16, 'sm']];
const RIGHT_LAYERS = [['halo', 72, 0.2, 'xl'], ['band', 40, 0.3, 'lg'], ['core', 10, 0.24, 'sm']];
const ECHO_LAYERS = [['band', 40, 0.07, 'lg']];
const RAY_SETS = {
  wide: [
    { id: 'left', from: [-440, 207.5], to: [-30, -14], stops: [[0, 0], [0.29, 0.5], [0.71, 1], [1, 0.5]], layers: LEFT_LAYERS },
    {
      id: 'right',
      from: [40, 80],
      to: [400, -181],
      stops: [[0, 0], [0.24, 0.6], [0.48, 1], [0.66, 0.78], [0.87, 0.34], [1, 0.15]],
      layers: RIGHT_LAYERS,
    },
    { id: 'echo', from: [150, 112], to: [400, -58], stops: [[0, 0], [0.5, 0.8], [1, 0.3]], layers: ECHO_LAYERS },
  ],
  narrow: [
    { id: 'left', from: [-275, 118.4], to: [-30, -14], stops: [[0, 0.64], [0.52, 1], [1, 0.5]], layers: LEFT_LAYERS },
    { id: 'right', from: [40, 80], to: [275, -90.5], stops: [[0, 0], [0.37, 0.6], [0.73, 1], [1, 0.8]], layers: RIGHT_LAYERS },
    { id: 'echo', from: [150, 112], to: [275, 27], stops: [[0, 0], [1, 0.78]], layers: ECHO_LAYERS },
  ],
};
const BLURS = [['xl', 26], ['lg', 15], ['sm', 5]];

// Small glowing dots and sparkles, positioned from the ring centre in reference px at 1440 (measured on
// a_hero.jpg; the stage scales them with --u and mirrors them in RTL). `far` ones sit outside a phone panel.
const SPARKLES = [
  { x: -302, y: -71, s: 3, far: true },
  { x: -256, y: -6, s: 3 },
  { x: -338, y: 144, s: 3, far: true },
  { x: -373, y: 151, s: 2.5, far: true },
  { x: -205, y: -197, s: 2 },
  { x: 134, y: -47, s: 2 },
  { x: 160, y: -33, s: 2.5 },
  { x: 254, y: -3, s: 2.5 },
  { x: 330, y: 96, s: 2, far: true },
];

/**
 * One set of streak rays as an overflow-visible SVG whose 1×1 viewBox maps one user unit to --u: the origin is
 * the ring centre and coordinates are reference px. Each set carries its own gradients and filters (a hidden
 * SVG's paint servers are not reliably usable by another SVG).
 */
function Rays({ set, className }) {
  const rays = RAY_SETS[set];
  const ref = (kind, id) => `hero-${set}-${kind}-${id}`;
  return (
    <svg className={className} viewBox="0 0 1 1" overflow="visible" focusable="false">
      <defs>
        {rays.map((ray) => (
          <linearGradient
            key={ray.id}
            id={ref('ray', ray.id)}
            gradientUnits="userSpaceOnUse"
            x1={ray.from[0]}
            y1={ray.from[1]}
            x2={ray.to[0]}
            y2={ray.to[1]}
          >
            {ray.stops.map(([offset, opacity]) => (
              <stop key={offset} offset={offset} stopOpacity={opacity} className={styles.rayStop} />
            ))}
          </linearGradient>
        ))}
        {/* Blur radii in reference px (user units scale with the stage). */}
        {BLURS.map(([id, deviation]) => (
          <filter key={id} id={ref('blur', id)} filterUnits="userSpaceOnUse" x="-560" y="-360" width="1120" height="720">
            <feGaussianBlur stdDeviation={deviation} />
          </filter>
        ))}
      </defs>
      {rays.flatMap((ray) =>
        ray.layers.map(([layer, width, opacity, blur]) => (
          <path
            key={`${ray.id}-${layer}`}
            d={`M${ray.from[0]} ${ray.from[1]} L${ray.to[0]} ${ray.to[1]}`}
            stroke={`url(#${ref('ray', ray.id)})`}
            strokeWidth={width}
            strokeOpacity={opacity}
            filter={`url(#${ref('blur', blur)})`}
            className={styles.ray}
          />
        ))
      )}
    </svg>
  );
}

export default async function Hero({ locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const tl = await getTranslations({ locale, namespace: 'layout' });
  const text = (tt, key, fallback = '') => (tt.has(key) ? tt(key) : fallback);
  const stats = t.has('hero.stats') && Array.isArray(t.raw('hero.stats')) ? t.raw('hero.stats') : [];
  const years = String(yearsOfExperience());
  const newTab = text(tl, 'a11y.opensInNewTab', '(opens in a new tab)');

  // Only the owner's real profiles (SPEC allowed deviation 2).
  const follow = [
    { id: 'github', href: site.social.github, label: text(tl, 'footer.github', 'GitHub') },
    { id: 'linkedin', href: site.social.linkedin, label: text(tl, 'footer.linkedin', 'LinkedIn') },
    { id: 'whatsapp', href: site.whatsapp, label: text(tl, 'footer.whatsapp', 'WhatsApp') },
    { id: 'mail', href: `mailto:${site.email}`, label: text(tl, 'footer.email', 'Email') },
  ];

  return (
    <Panel id="home" className={styles.hero} labelledBy="hero-title">
      <div className={styles.copy}>
        {t.has('hero.badge') ? <Badge>{t('hero.badge')}</Badge> : null}
        <h1 id="hero-title" className={styles.title}>
          <Segments segments={t.has('hero.headline') ? t.raw('hero.headline') : ''} />
        </h1>
        {t.has('hero.summary') ? <p className={styles.lead}>{t('hero.summary')}</p> : null}
        <div className={styles.actions}>
          <Button href="/#contact" icon="arrow-up-right">
            {text(t, 'hero.ctaPrimary', 'Hire Me')}
          </Button>
          <Button href="/#projects" variant="outline" icon="grid-2x2">
            {text(t, 'hero.ctaSecondary', 'View My Work')}
          </Button>
        </div>
        <div className={styles.follow}>
          <p className={styles.followLabel} id="hero-follow">
            {text(t, 'hero.followLabel', 'Follow me on')}
          </p>
          <ul className={styles.social} role="list" aria-labelledby="hero-follow">
            {follow.map((item) => {
              const external = /^https?:/.test(item.href);
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={styles.socialLink}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <Icon name={item.id} size={20} />
                    <span className="visually-hidden">
                      {item.label}
                      {external ? ` ${newTab}` : ''}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className={styles.visual}>
        {/* Glow, streak, circles, orbits, sparkles — clipped to the panel's rounded box. */}
        <div className={styles.decor} aria-hidden="true">
          <span className={styles.shade} />
          <div className={styles.stage}>
            <div className={styles.mirror}>
              <Rays set="wide" className={`${styles.rays} ${styles.raysWide}`} />
              <Rays set="narrow" className={`${styles.rays} ${styles.raysNarrow}`} />
              <span className={styles.outer} />
              <span className={styles.ring} />
              <svg className={styles.orbits} viewBox="0 0 1 1" overflow="visible" focusable="false">
                <ellipse cx="-70" cy="-159" rx="150" ry="26" transform="rotate(-13 -70 -159)" />
                <ellipse cx="261" cy="-92" rx="63" ry="13.5" transform="rotate(-10 261 -92)" className={styles.far} />
              </svg>
              <span className={`${styles.dot} ${styles.dotLeft}`} />
              <span className={`${styles.dot} ${styles.dotRight} ${styles.far}`} />
              <span className={`${styles.dot} ${styles.dotTop}`} />
              <span className={`${styles.planet} ${styles.far}`} />
              {SPARKLES.map((p, index) => (
                <span
                  key={index}
                  className={p.far ? `${styles.sparkle} ${styles.far}` : styles.sparkle}
                  style={{ '--x': p.x, '--y': p.y, '--s': `${p.s}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.portraitStage}>
          <div className={styles.portrait}>
            <Image
              src={site.cutout.src}
              width={site.cutout.width}
              height={site.cutout.height}
              alt={text(t, 'hero.portraitAlt', site.name[locale] ?? site.name.en)}
              priority
              sizes="(min-width: 1200px) 620px, (min-width: 640px) 500px, 92vw"
              className={styles.portraitImg}
            />
          </div>
        </div>

        {stats.length ? (
          <ul className={styles.stats} role="list">
            {stats.map((stat) => (
              <li key={stat.id} className={styles.stat}>
                <span className={styles.statTop}>
                  <span className={styles.statIcon} aria-hidden="true">
                    <Icon name={STAT_ICONS[stat.id] ?? 'sparkle'} size={15} />
                  </span>
                  <bdi dir="ltr" className={styles.statValue}>
                    {String(stat.value ?? '').replace('{years}', years)}
                  </bdi>
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Panel>
  );
}
