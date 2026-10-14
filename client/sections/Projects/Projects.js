/**
 * Projects — the home "Featured Projects" panel (SPEC §4.4). Async server component.
 *
 * export default async function Projects({ locale, number })
 *   locale  "en" | "ar"
 *   number  eyebrow number ("04") — computed by app/[locale]/page.js from the rendered order
 *
 * Panel #projects: header row [Eyebrow as the panel's <h2> | "View all projects →" → /work] → the first 3
 * featured projects (content/projects.js featuredProjects, display order) as ProjectCard, 3 columns ≥ 1100px,
 * 2 below (the odd third card spans the row as an image | text card), 1 below 700px.
 * Messages: home.projects.{label, viewAll}.
 */
import { getTranslations } from 'next-intl/server';
import { featuredProjects } from '../../../content/projects';
import { Link } from '../../../i18n/navigation';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Icon from '../../ui/Icon/Icon';
import Reveal from '../../ui/Reveal/Reveal';
import ProjectCard from '../ProjectCard/ProjectCard';
import styles from './Projects.module.scss';

export default async function Projects({ locale, number }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const projects = featuredProjects.slice(0, 3);
  const viewAll = t.has('projects.viewAll') ? t('projects.viewAll') : '';

  return (
    <Panel id="projects" labelledBy="projects-title">
      <div className={styles.header}>
        <Eyebrow
          as="h2"
          id="projects-title"
          number={number}
          label={t.has('projects.label') ? t('projects.label') : ''}
        />
        {viewAll ? (
          <Link href="/work" className={styles.viewAll} title={viewAll}>
            {viewAll}
            <Icon name="arrow-right" size={14} className={styles.arrow} />
          </Link>
        ) : null}
      </div>
      <ul role="list" className={styles.grid}>
        {projects.map((project, index) => (
          <Reveal as="li" key={project.slug} delay={index * 60} className={styles.item}>
            <ProjectCard slug={project.slug} locale={locale} />
          </Reveal>
        ))}
      </ul>
    </Panel>
  );
}
