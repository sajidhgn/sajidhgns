/**
 * Skills — the "Skills & Stack" panel #skills (SPEC §4.2; OWNER UPDATE "technology icons same to same").
 * Server component.
 *
 * export default async function Skills({ locale, number })
 *   locale  "en" | "ar"
 *   number  eyebrow number ("02") — computed by app/[locale]/page.js from the rendered order
 *
 * Eyebrow as the panel's <h2> → 20 tiles, 5 × 4 (3 columns when the panel is narrow), each a
 * full-colour BrandIcon + name → note pill straddling the panel's bottom edge (the panel's overflow is visible).
 * Tile set and order = the icon set (BrandIcon BRAND_IDS, i.e. SCHEMA.md home.skills.items in the reference's
 * order). Names come from messages home.skills.items by id, falling back to the brand's own name, so the grid
 * stays complete even while a locale file is being updated.
 * Messages: home.skills.label / items / note.
 */
import { getTranslations } from 'next-intl/server';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Icon from '../../ui/Icon/Icon';
import Reveal from '../../ui/Reveal/Reveal';
import BrandIcon, { BRAND_IDS, brandName } from '../BrandIcon/BrandIcon';
import styles from './Skills.module.scss';

const COLUMNS = 5;

export default async function Skills({ locale, number }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const items = t.has('skills.items') ? t.raw('skills.items') : [];
  const names = new Map(
    (Array.isArray(items) ? items : []).filter((item) => item && item.id && item.name).map((item) => [item.id, item.name])
  );
  const note = t.has('skills.note') ? t('skills.note') : '';

  return (
    <Panel id="skills" className={styles.panel} labelledBy="skills-title">
      <Eyebrow as="h2" id="skills-title" number={number} label={t('skills.label')} />
      <ul className={styles.grid} role="list">
        {BRAND_IDS.map((id, index) => (
          // Diagonal wave: 60ms per step along row + column.
          <Reveal
            as="li"
            key={id}
            className={styles.cell}
            delay={(Math.floor(index / COLUMNS) + (index % COLUMNS)) * 60}
          >
            <span className={styles.tile}>
              <BrandIcon id={id} size={44} className={styles.logo} />
              <span className={styles.name}>{names.get(id) || brandName(id)}</span>
            </span>
          </Reveal>
        ))}
      </ul>
      {note ? (
        <p className={styles.note}>
          <Icon name="heart" size={12} className={styles.heart} />
          <span>{note}</span>
        </p>
      ) : null}
    </Panel>
  );
}
