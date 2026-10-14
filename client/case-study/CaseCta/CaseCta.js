/**
 * CaseCta — the case study's closing contact panel (SPEC §5 (6)), built like the reference's "Get in touch"
 * column: eyebrow → divider → heading with a gold accent → paragraph → email / phone rows (the reference's
 * contact info list) → Primary "Hire Me" (→ /#contact) + Outline "Download CV". Async server component.
 *
 * export default async function CaseCta({ locale, number, className })
 *   locale     "en" | "ar"
 *   number     eyebrow number (continues the page's sequence); omit to hide the badge
 *   className  extra class on the panel
 *
 * Labels: case.cta.* (title is a segments array, SCHEMA.md).
 */
import { getTranslations } from 'next-intl/server';
import { site } from '../../../content/site';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Segments from '../../ui/Segments/Segments';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import cx from '../../ui/cx';
import styles from './CaseCta.module.scss';

export default async function CaseCta({ locale, number, className }) {
  const t = await getTranslations({ locale, namespace: 'case' });
  const label = (key) => (t.has(key) ? t(key) : '');
  const title = t.has('cta.title') ? t.raw('cta.title') : '';
  const contacts = [
    { id: 'email', icon: 'mail', href: `mailto:${site.email}`, value: site.email, label: label('cta.email') },
    { id: 'phone', icon: 'phone', href: `tel:${site.phone}`, value: site.phoneDisplay, label: label('cta.phone') },
  ].filter((item) => item.label && item.value);

  return (
    <Panel id="case-contact" labelledBy="case-cta-title" glow className={cx(styles.cta, className)}>
      {label('cta.label') ? <Eyebrow number={number} label={label('cta.label')} /> : null}
      <hr className={styles.divider} />
      <h2 id="case-cta-title" className={styles.title}>
        <Segments segments={title} />
      </h2>
      {label('cta.body') ? <p className={styles.body}>{label('cta.body')}</p> : null}
      {contacts.length ? (
        <ul role="list" className={styles.contacts}>
          {contacts.map((item) => (
            <li key={item.id}>
              <a href={item.href} className={styles.contact} title={`${item.label}: ${item.value}`}>
                <span className={styles.tile} aria-hidden="true">
                  <Icon name={item.icon} size={18} />
                </span>
                <span className={styles.contactText}>
                  <span className={styles.contactLabel}>{item.label}</span>
                  <bdi dir="ltr" className={styles.contactValue}>
                    {item.value}
                  </bdi>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <div className={styles.actions}>
        <Button href="/#contact" icon="arrow-up-right">
          {label('cta.primary')}
        </Button>
        <Button href={site.resumePdf} variant="outline" icon="download" download>
          {label('cta.secondary')}
        </Button>
      </div>
    </Panel>
  );
}
