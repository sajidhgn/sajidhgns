/**
 * WorkIndex — body of /[locale]/work, "All projects" (SPEC §5). Async server component; render it inside the
 * page's `.container.bento`.
 *
 * export default async function WorkIndex({ locale })
 *   locale  "en" | "ar"
 *
 * Panels, in the home page's design language:
 *   1. hero — Eyebrow "PROJECTS", the page's <h1> "Selected work", intro, and a small stats card (like the
 *      home hero's) with counts derived from content/projects.js: projects, case studies, live sites
 *   2. "01 Featured case studies" — the 4 featured projects as large cards, 2 columns
 *   3. "02 More projects" — the other projects as reference cards, 3 columns (2 / 1 on smaller screens)
 *   4. CTA — "Have a role or project in mind?" + Hire Me (→ /#contact) and Download CV (site.resumePdf)
 * Every project appears once, featured first, in content/projects.js display order.
 * Messages: home.projects.{pageLabel, pageTitle, pageIntro, ctaTitle, ctaBody}, home.hero.ctaPrimary,
 * home.about.cta, work.{featuredTitle, moreTitle, stats.*}.
 */
import { getTranslations } from 'next-intl/server';
import { featuredProjects, moreProjects, projects } from '../../../content/projects';
import { site } from '../../../content/site';
import { formatNumber } from '../../../lib/i18n';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import Reveal from '../../ui/Reveal/Reveal';
import cx from '../../ui/cx';
import ProjectCard from '../../sections/ProjectCard/ProjectCard';
import styles from './WorkIndex.module.scss';

export default async function WorkIndex({ locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const tw = await getTranslations({ locale, namespace: 'work' });
  const home = (key, fallback = '') => (t.has(key) ? t(key) : fallback);
  const work = (key, fallback = '') => (tw.has(key) ? tw(key) : fallback);

  const groups = [
    { id: 'work-featured', number: '01', label: work('featuredTitle', 'Featured case studies'), projects: featuredProjects, size: 'lg' },
    { id: 'work-more', number: '02', label: work('moreTitle', 'More projects'), projects: moreProjects, size: 'md' },
  ].filter((group) => group.projects.length);

  const ctaTitle = home('projects.ctaTitle');
  const ctaBody = home('projects.ctaBody');
  const intro = home('projects.pageIntro');

  // Facts from the content model only (CONTRACT §0.1): nothing here is an estimate.
  const stats = [
    { id: 'projects', icon: 'folder', value: projects.length, label: work('stats.projects') },
    { id: 'caseStudies', icon: 'file-text', value: featuredProjects.length, label: work('stats.caseStudies') },
    { id: 'liveSites', icon: 'globe', value: projects.filter((project) => project.liveUrl).length, label: work('stats.liveSites') },
  ].filter((stat) => stat.label && stat.value > 0);

  return (
    <>
      <Panel className={styles.hero} labelledBy="work-title" glow>
        <div className={styles.heroCopy}>
          <Eyebrow label={home('projects.pageLabel', 'Projects')} />
          <h1 id="work-title" className={styles.title}>
            {home('projects.pageTitle', 'Selected work')}
          </h1>
          {intro ? <p className={styles.intro}>{intro}</p> : null}
        </div>
        {stats.length ? (
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.id} className={styles.stat}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>
                  <span className={styles.statIcon} aria-hidden="true">
                    <Icon name={stat.icon} size={16} />
                  </span>
                  {formatNumber(stat.value, locale)}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Panel>

      {groups.map((group) => (
        <Panel key={group.id} labelledBy={group.id}>
          <Eyebrow as="h2" id={group.id} number={group.number} label={group.label} />
          <ul role="list" className={cx(styles.grid, group.size === 'lg' ? styles.gridLg : styles.gridMd)}>
            {group.projects.map((project, index) => (
              <Reveal as="li" key={project.slug} delay={(index % 3) * 60} className={styles.item}>
                <ProjectCard
                  slug={project.slug}
                  locale={locale}
                  size={group.size}
                  // The first featured covers are this page's LCP (there is no portrait here).
                  priority={group.size === 'lg' && index < 2}
                />
              </Reveal>
            ))}
          </ul>
        </Panel>
      ))}

      {ctaTitle ? (
        <Panel className={styles.cta} labelledBy="work-cta" glow>
          <div className={styles.ctaCopy}>
            <h2 id="work-cta" className={styles.ctaTitle}>
              {ctaTitle}
            </h2>
            {ctaBody ? <p className={styles.ctaBody}>{ctaBody}</p> : null}
          </div>
          <div className={styles.ctaActions}>
            <Button href="/#contact" icon="arrow-up-right">
              {home('hero.ctaPrimary', 'Hire Me')}
            </Button>
            <Button href={site.resumePdf} variant="outline" icon="download" download>
              {home('about.cta', 'Download CV')}
            </Button>
          </div>
        </Panel>
      ) : null}
    </>
  );
}
