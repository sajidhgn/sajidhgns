/**
 * Contact — the "GET IN TOUCH" panel (SPEC §4.7, reference crop g_contact.jpg). Server component.
 *
 * export default async function Contact({ locale, number })
 *   locale  "en" | "ar"
 *   number  eyebrow number ("07" with testimonials, "06" without) — computed by app/[locale]/page.js
 *
 * Desktop (≥ 1024px): [intro: eyebrow → 1px divider → <h2> segments ("amazing" in gold) → paragraph] |
 * [card: ContactForm | 1px divider | info list]. Below 1024px the intro stacks above the card; below 640px
 * the info list also drops under the form.
 * Info list: Email (mailto, dir=ltr), Phone (tel:, dir=ltr), Location, Availability — values from
 * content/site.js and home.contact.info.*; labels from home.contact.info.*Label.
 * Messages: home.contact.* (content) + contact.* (form UI, read by ContactForm on the client).
 */
import { getTranslations } from 'next-intl/server';
import { site } from '../../../content/site';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Segments from '../../ui/Segments/Segments';
import Icon from '../../ui/Icon/Icon';
import Reveal from '../../ui/Reveal/Reveal';
import ContactForm from '../ContactForm/ContactForm';
import styles from './Contact.module.scss';

// "Immediate joiner · Transferable Iqama": a no-break space keeps each "·" on the line of the words before it.
const keepSeparators = (value) => value.replace(/ · /g, ' · ');

export default async function Contact({ locale, number }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const text = (key, fallback = '') => (t.has(key) ? t(key) : fallback);
  const body = text('contact.body');

  const info = [
    {
      id: 'email',
      icon: 'mail',
      label: text('contact.info.emailLabel', 'Email'),
      value: (
        <a className={styles.link} href={`mailto:${site.email}`} dir="ltr">
          {site.email}
        </a>
      ),
    },
    {
      id: 'phone',
      icon: 'phone',
      label: text('contact.info.phoneLabel', 'Phone'),
      value: (
        <a className={styles.link} href={`tel:${site.phone}`} dir="ltr">
          {site.phoneDisplay}
        </a>
      ),
    },
    {
      id: 'location',
      icon: 'map-pin',
      label: text('contact.info.locationLabel', 'Location'),
      value: keepSeparators(text('contact.info.location')),
    },
    {
      id: 'availability',
      icon: 'clock',
      label: text('contact.info.availabilityLabel', 'Availability'),
      value: keepSeparators(text('contact.info.availability')),
    },
  ].filter((row) => row.value);

  return (
    <Panel id="contact" labelledBy="contact-title" className={styles.panel}>
      <Reveal className={styles.intro}>
        <Eyebrow number={number} label={text('contact.label', 'Get in Touch')} />
        <span className={styles.rule} aria-hidden="true" />
        <h2 id="contact-title" className={styles.title}>
          <Segments segments={t.has('contact.heading') ? t.raw('contact.heading') : ''} />
        </h2>
        {body ? <p className={styles.body}>{body}</p> : null}
      </Reveal>

      <Reveal className={styles.card} delay={60}>
        <div className={styles.formSide}>
          <ContactForm locale={locale} />
        </div>
        <dl className={styles.info}>
          {info.map((row) => (
            <div key={row.id} className={styles.row}>
              <dt className={styles.term}>
                <span className={styles.tile} aria-hidden="true">
                  <Icon name={row.icon} size={18} />
                </span>
                {row.label}
              </dt>
              <dd className={styles.value}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Panel>
  );
}
