/**
 * CaseMeta — the case hero's "Project details" card (SPEC §5 meta chips): Role · Platform · Industry ·
 * Timeline · Team — only the fields that have a value — plus the stack as tag chips. Async server component.
 *
 * export default async function CaseMeta({ slug, locale, className })
 *   slug       project slug
 *   locale     "en" | "ar"
 *   className  extra class on the card
 *
 * Styled like the reference's contact info list (gold icon tile + label + value) on a glass card; the stack
 * chips match the project-card tags. Labels: case.detailsLabel, case.meta.*; values: projects.items.<slug>.meta.*;
 * stack: content/projects.js. Nothing to show → renders nothing.
 */
import { getTranslations } from 'next-intl/server';
import cx from '../../ui/cx';
import Icon from '../../ui/Icon/Icon';
import { getCase } from '../caseContent';
import styles from './CaseMeta.module.scss';

export default async function CaseMeta({ slug, locale, className }) {
  const data = await getCase(slug, locale);
  if (!data) return null;
  const t = await getTranslations({ locale, namespace: 'case' });
  const label = (key) => (t.has(key) ? t(key) : '');
  const stackLabel = label('meta.stack');
  const rows = data.meta;
  const showStack = data.stack.length > 0 && Boolean(stackLabel);
  if (!rows.length && !showStack) return null;

  return (
    <div className={cx(styles.card, className)}>
      {label('detailsLabel') ? <p className={styles.title}>{label('detailsLabel')}</p> : null}
      <dl className={styles.list}>
        {rows.map((row) => (
          <div key={row.id} className={styles.row}>
            <dt className={styles.term}>
              <span className={styles.tile}>
                <Icon name={row.icon} size={18} />
              </span>
              {row.label}
            </dt>
            <dd className={styles.value}>{row.value}</dd>
          </div>
        ))}
        {showStack ? (
          <div className={cx(styles.row, styles.stackRow)}>
            <dt className={styles.term}>
              <span className={styles.tile}>
                <Icon name="code" size={18} />
              </span>
              {stackLabel}
            </dt>
            <dd className={styles.value}>
              <ul role="list" className={styles.chips}>
                {data.stack.map((tech) => (
                  <li key={tech} className={styles.chip} lang="en">
                    {tech}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
