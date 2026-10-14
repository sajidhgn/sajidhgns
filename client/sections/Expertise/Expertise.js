/**
 * Expertise — the reference's SERVICES panel (SPEC §4.3, OWNER UPDATE). Async server component.
 *
 * export default async function Expertise({ locale, number })
 *   locale  "en" | "ar"
 *   number  eyebrow number ("03") — computed by app/[locale]/page.js from the rendered order
 *
 * Panel #services: Eyebrow (the panel's <h2>, label home.expertise.label = "Services") → 4 cards in the
 * reference order (Web Development, UI/UX Design, API Development, Performance Optimization). Each card:
 * 48px gold-outlined tile with a gold line mark (ServiceIcon: webdev | uiux | api | performance) + <h3> title,
 * description, "Learn more →" to a case study. The link is stretched over the card, so the whole card is
 * one target; its accessible name gets the card title ("Learn more about Web Development").
 * Messages: home.expertise.{label, items[{ id, icon, title, body, link{label, href} }]}, work.aboutService.
 * Empty strings hide their slot; an item without a link renders as a plain (non-interactive) card.
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '../../../i18n/navigation';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Icon from '../../ui/Icon/Icon';
import Reveal from '../../ui/Reveal/Reveal';
import cx from '../../ui/cx';
import ServiceIcon, { SERVICE_ICON_NAMES } from './ServiceIcon';
import styles from './Expertise.module.scss';

// Icon ids from the pre-SCHEMA home.json keep a sensible mark until the messages are migrated.
const LEGACY_UI_ICONS = { systems: 'layers', frontend: 'code' };

const list = (t, key) => (t.has(key) && Array.isArray(t.raw(key)) ? t.raw(key) : []);
const text = (value) => (typeof value === 'string' ? value.trim() : '');
// App routes only ("/work/ounlab"); anything else is ignored rather than rendered as a broken link.
const isAppPath = (href) => typeof href === 'string' && href.startsWith('/') && !href.startsWith('//');

function Glyph({ name }) {
  if (SERVICE_ICON_NAMES.includes(name)) return <ServiceIcon name={name} className={styles.glyph} />;
  return <Icon name={LEGACY_UI_ICONS[name] ?? 'sparkle'} size={26} className={styles.glyph} />;
}

export default async function Expertise({ locale, number }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const tw = await getTranslations({ locale, namespace: 'work' });
  const items = list(t, 'expertise.items').filter((item) => item && text(item.title));
  const label = t.has('expertise.label') ? t('expertise.label') : '';

  return (
    <Panel id="services" labelledBy="services-title">
      <Eyebrow as="h2" id="services-title" number={number} label={label} />
      {items.length ? (
        <ul role="list" className={styles.grid}>
          {items.map((item, index) => {
            const title = text(item.title);
            const body = text(item.body);
            const href = isAppPath(item.link?.href) ? item.link.href : '';
            const linkLabel = href ? text(item.link?.label) : '';
            const about = tw.has('aboutService') ? tw('aboutService', { title }) : title;

            return (
              <Reveal as="li" key={item.id ?? index} delay={index * 60} className={styles.item}>
                <div className={cx(styles.card, linkLabel && styles.interactive)}>
                  <div className={styles.head}>
                    <span className={styles.tile} aria-hidden="true">
                      <Glyph name={item.icon ?? item.id} />
                    </span>
                    <h3 className={styles.title}>{title}</h3>
                  </div>
                  {body ? <p className={styles.body}>{body}</p> : null}
                  {linkLabel ? (
                    <p className={styles.more}>
                      <Link href={href} className={cx('stretched-link', styles.link)} title={about}>
                        {linkLabel}
                        <span className="visually-hidden"> {about}</span>
                        <Icon name="arrow-right" size={14} className={styles.arrow} />
                      </Link>
                    </p>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </ul>
      ) : null}
    </Panel>
  );
}
