/**
 * CaseTldr — the "At a glance" panel: Problem / Approach / Impact cards with gold icon tiles, built like the
 * reference's Services cards (SPEC §5). Async server component.
 *
 * export default async function CaseTldr({ slug, locale, number })
 *   slug    project slug
 *   locale  "en" | "ar"
 *   number  eyebrow number ("01"); default: the computed one
 *
 * Only cards with text render; none → no panel. Text: projects.items.<slug>.tldr.*; labels: case.tldr.*.
 */
import { getTranslations } from 'next-intl/server';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Icon from '../../ui/Icon/Icon';
import Reveal from '../../ui/Reveal/Reveal';
import { getCase } from '../caseContent';
import styles from './CaseTldr.module.scss';

export default async function CaseTldr({ slug, locale, number }) {
  const data = await getCase(slug, locale);
  if (!data?.tldr.length) return null;
  const t = await getTranslations({ locale, namespace: 'case' });

  return (
    <Panel id="case-tldr" labelledBy="case-tldr-title">
      <Eyebrow
        as="h2"
        id="case-tldr-title"
        number={number ?? data.tldrNumber}
        label={t.has('tldr.label') ? t('tldr.label') : ''}
      />
      <ul role="list" className={styles.grid} style={{ '--cols': Math.min(data.tldr.length, 3) }}>
        {data.tldr.map((item, index) => (
          <Reveal as="li" key={item.id} delay={index * 60} className={styles.card}>
            <div className={styles.head}>
              <span className={styles.tile}>
                <Icon name={item.icon} size={22} />
              </span>
              <h3 className={styles.title}>{item.label}</h3>
            </div>
            <p className={styles.body}>{item.body}</p>
          </Reveal>
        ))}
      </ul>
    </Panel>
  );
}
