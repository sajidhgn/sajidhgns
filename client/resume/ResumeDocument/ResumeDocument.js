/**
 * ResumeDocument — the résumé page body (SPEC §5): a dark, panel-styled document on screen and a plain,
 * single-column, ATS-friendly A4 document in print. Server component.
 *
 * export default async function ResumeDocument({ locale })
 *   locale  "en" | "ar"
 *
 * Layout (DOM order = reading order = print order):
 *   header panel   kicker · ring portrait · <h1> name · resume.headline · availability badge ·
 *                  Download PDF (site.resumePdf) + Print · contact line (email, phone, LinkedIn, GitHub, portfolio)
 *   numbered panels (eyebrow = the section's <h2>): Summary, Skills, Experience, Selected projects,
 *                  then a row of Education | Certifications | Languages. Numbers follow the rendered order.
 *
 * Data: messages resume.* (content), experience.roles.* (REAL titles, highlights), resumeUi.* (labels),
 * projects.items.*.title (case-study links); content/site.js, content/experience.js, content/projects.js.
 * Content is filled in parallel by the content writers, so everything is defensive: "TODO…" placeholders and
 * empty strings are treated as unknown and their slot (or the whole section) is not rendered.
 *
 * Print: links that matter on paper carry their address as text (contact values, case-study URLs) and
 * absolute production URLs, so a PDF printed from any host keeps working links. Decoration, buttons and the
 * portrait are screen-only.
 */
import Image from 'next/image';
import { getMessages } from 'next-intl/server';
import { Link } from '../../../i18n/navigation';
import { site } from '../../../content/site';
import { roles as roleList } from '../../../content/experience';
import { getProject, projects as projectList } from '../../../content/projects';
import { absoluteUrl, yearsOfExperience } from '../../../lib/site';
import { formatMonthYear } from '../../../lib/i18n';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Badge from '../../ui/Badge/Badge';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import Reveal from '../../ui/Reveal/Reveal';
import cx from '../../ui/cx';
import PrintButton from '../PrintButton/PrintButton';
import styles from './ResumeDocument.module.scss';

// English fallbacks for resumeUi labels, so a missing key never blanks a heading.
const FALLBACK_UI = {
  label: 'Résumé',
  download: 'Download PDF',
  print: 'Print',
  printHint: '',
  present: 'Present',
  caseStudy: 'View case study',
  sections: {
    summary: 'Summary',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Selected projects',
    education: 'Education',
    certifications: 'Certifications',
    languages: 'Languages',
  },
  contact: { label: 'Contact details' },
};

const PLACEHOLDER = /^TODO\b/i;
// Separator glued to the item before it (no-break space), so a wrapped line never starts with the dot.
const SEP = '\u00A0· ';

/** A real, non-placeholder string — or "". */
const text = (value) => {
  if (typeof value === 'number') return String(value);
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return trimmed && !PLACEHOLDER.test(trimmed) ? trimmed : '';
};
const texts = (list) => (Array.isArray(list) ? list.map(text).filter(Boolean) : []);

/** "https://www.linkedin.com/in/sajidhgn/" → "linkedin.com/in/sajidhgn" */
const displayUrl = (url) => url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '');

const matchKey = (value) => text(value).toLowerCase().replace(/[^a-z0-9]+/g, '');

/** Finds the case-study slug for a résumé project name ("OunLab (OUN.AI)" → "ounlab"), or null. */
function findSlug(name, projectItems) {
  const key = matchKey(name);
  if (!key) return null;
  const hit = projectList.find((project) => {
    const title = matchKey(projectItems?.[project.slug]?.title);
    return key === title || key === project.slug || key.startsWith(project.slug);
  });
  return hit ? hit.slug : null;
}

function selectedProjects(messages, englishMessages) {
  const list = Array.isArray(messages.resume?.selectedProjects) ? messages.resume.selectedProjects : [];
  const englishList = Array.isArray(englishMessages.resume?.selectedProjects) ? englishMessages.resume.selectedProjects : [];
  const items = messages.projects?.items ?? {};
  const englishItems = englishMessages.projects?.items ?? {};

  return list
    .map((entry, index) => {
      const name = text(entry?.name);
      if (!name) return null;
      // A translated name that no longer matches falls back to the same position in the English résumé
      // (content namespaces mirror the English shape and order).
      const slug =
        findSlug(name, items) ||
        (englishList.length === list.length ? findSlug(englishList[index]?.name, englishItems) : null);
      return {
        key: `${index}-${name}`,
        name,
        summary: text(entry?.summary),
        slug: slug && getProject(slug) ? slug : null,
      };
    })
    .filter(Boolean);
}

function experienceRoles(messages) {
  const byId = messages.experience?.roles ?? {};
  return roleList
    .map((role) => {
      const copy = byId[role.id] ?? {};
      return {
        ...role,
        title: text(copy.title),
        location: text(copy.location),
        mode: text(copy.mode),
        highlights: texts(copy.highlights),
      };
    })
    .filter((role) => role.title);
}

// The hero's stats (home.hero.stats) — the same facts as the home page, {years} derived from site.careerStart.
const STAT_ICONS = { years: 'briefcase', projects: 'grid-2x2', industries: 'layers' };

function heroStats(messages) {
  const list = Array.isArray(messages.home?.hero?.stats) ? messages.home.hero.stats : [];
  const years = String(yearsOfExperience());
  return list
    .map((stat) => ({
      id: text(stat?.id) || text(stat?.label),
      value: text(stat?.value).replace('{years}', years),
      label: text(stat?.label),
    }))
    .filter((stat) => stat.value && stat.label && !/[{}]/.test(stat.value));
}

function SectionPanel({ id, number, label, delay = 0, className, children }) {
  return (
    <Reveal delay={delay} className={styles.reveal}>
      <Panel id={id} labelledBy={`resume-${id}`} className={cx(styles.section, className)}>
        <Eyebrow as="h2" id={`resume-${id}`} number={number} label={label} className={styles.heading} />
        {children}
      </Panel>
    </Reveal>
  );
}

export default async function ResumeDocument({ locale }) {
  const messages = await getMessages({ locale });
  const englishMessages = locale === 'en' ? messages : await getMessages({ locale: 'en' });

  const rawUi = messages.resumeUi ?? {};
  const ui = {
    ...FALLBACK_UI,
    ...rawUi,
    sections: { ...FALLBACK_UI.sections, ...(rawUi.sections ?? {}) },
    contact: { ...FALLBACK_UI.contact, ...(rawUi.contact ?? {}) },
  };
  const label = (value, fallback) => text(value) || fallback;
  const newTab = text(messages.layout?.a11y?.opensInNewTab) || '(opens in new tab)';

  const resume = messages.resume ?? {};
  const name = site.name[locale] ?? site.name.en;
  const headline = text(resume.headline);
  const availability = texts(ui.availability);
  const summary = text(resume.summary);
  const stats = heroStats(messages);
  const skills = (Array.isArray(resume.skills) ? resume.skills : [])
    .map((group, index) => ({ key: `${index}-${text(group?.group)}`, group: text(group?.group), items: texts(group?.items) }))
    .filter((group) => group.items.length);
  const roles = experienceRoles(messages);
  const projects = selectedProjects(messages, englishMessages);
  const educationCopy = resume.education ?? {};
  const education = {
    degree: text(educationCopy.degree),
    school: text(educationCopy.school),
    location: text(educationCopy.location),
    year: text(educationCopy.year),
  };
  const hasEducation = Boolean(education.degree || education.school);
  const certifications = texts(resume.certifications);
  const languages = texts(resume.languages);

  // Section numbers follow the rendered order (sections without content are skipped).
  const order = [
    summary && 'summary',
    skills.length && 'skills',
    roles.length && 'experience',
    projects.length && 'projects',
    hasEducation && 'education',
    certifications.length && 'certifications',
    languages.length && 'languages',
  ].filter(Boolean);
  const number = (id) => String(order.indexOf(id) + 1).padStart(2, '0');
  const present = label(ui.present, FALLBACK_UI.present);

  const contacts = [
    { id: 'email', icon: 'mail', href: `mailto:${site.email}`, value: site.email },
    { id: 'phone', icon: 'phone', href: `tel:${site.phone}`, value: site.phoneDisplay },
    { id: 'linkedin', icon: 'linkedin', href: site.social.linkedin, value: displayUrl(site.social.linkedin), external: true },
    { id: 'github', icon: 'github', href: site.social.github, value: displayUrl(site.social.github), external: true },
    { id: 'website', icon: 'globe', href: absoluteUrl(`/${locale}`), value: displayUrl(site.url) },
  ];

  const factsCount = [hasEducation, certifications.length, languages.length].filter(Boolean).length;

  return (
    <div className={cx('container', styles.page)}>
      <article className={styles.resume} aria-labelledby="resume-name">
        <Panel as="header" className={styles.header} glow>
          <Eyebrow label={label(ui.label, FALLBACK_UI.label)} className={styles.kicker} />

          <div className={styles.intro}>
            <div className={styles.avatar} aria-hidden="true">
              <span className={styles.avatarRing} />
              <span className={styles.avatarClip}>
                <Image
                  src={site.cutout.src}
                  width={site.cutout.width}
                  height={site.cutout.height}
                  sizes="148px"
                  alt=""
                  priority
                  className={styles.avatarImg}
                />
              </span>
            </div>

            <div className={styles.identity}>
              <h1 id="resume-name" className={styles.name}>
                {name}
              </h1>
              {headline ? <p className={styles.headline}>{headline}</p> : null}
              {availability.length ? <Badge className={styles.status}>{availability.join(SEP)}</Badge> : null}
            </div>

            <div className={styles.actions} data-print="hide">
              <div className={styles.buttons}>
                <Button href={site.resumePdf} download icon="download" className={styles.button}>
                  {label(ui.download, FALLBACK_UI.download)}
                </Button>
                <PrintButton
                  label={label(ui.print, FALLBACK_UI.print)}
                  describedBy={text(ui.printHint) ? 'resume-print-hint' : undefined}
                  className={styles.button}
                />
              </div>
              {text(ui.printHint) ? (
                <p id="resume-print-hint" className={styles.hint}>
                  {text(ui.printHint)}
                </p>
              ) : null}
            </div>
          </div>

          <ul className={styles.contact} role="list" aria-label={label(ui.contact?.label, FALLBACK_UI.contact.label)}>
            {contacts.map((item) => (
              <li key={item.id} className={styles.contactItem}>
                <a
                  href={item.href}
                  className={styles.contactLink}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className={styles.contactIcon} aria-hidden="true">
                    <Icon name={item.icon} size={16} />
                  </span>
                  <bdi dir="ltr" className={styles.contactValue}>
                    {item.value}
                  </bdi>
                  {item.external ? <span className={cx('visually-hidden', styles.newTab)}> {newTab}</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </Panel>

        {summary ? (
          <SectionPanel id="summary" number={number('summary')} label={ui.sections.summary}>
            <div className={cx(styles.summaryBody, stats.length && styles.withStats)}>
              <p className={styles.summary}>{summary}</p>
              {stats.length ? (
                <ul className={styles.stats} role="list" data-print="hide">
                  {stats.map((stat) => (
                    <li key={stat.id} className={styles.stat}>
                      <span className={styles.statTop}>
                        <span className={styles.statIcon} aria-hidden="true">
                          <Icon name={STAT_ICONS[stat.id] ?? 'sparkle'} size={16} />
                        </span>
                        <bdi dir="ltr" className={styles.statValue}>
                          {stat.value}
                        </bdi>
                      </span>
                      <span className={styles.statLabel}>{stat.label}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </SectionPanel>
        ) : null}

        {skills.length ? (
          <SectionPanel id="skills" number={number('skills')} label={ui.sections.skills}>
            <div className={styles.skillGroups}>
              {skills.map((group) => (
                <div key={group.key} className={styles.skillGroup}>
                  {group.group ? <h3 className={styles.skillName}>{group.group}</h3> : null}
                  <ul className={styles.chips} role="list">
                    {group.items.map((item) => (
                      <li key={item} className={styles.chip}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SectionPanel>
        ) : null}

        {roles.length ? (
          <SectionPanel id="experience" number={number('experience')} label={ui.sections.experience}>
            <ol className={styles.timeline} role="list">
              {roles.map((role) => {
                const place = [role.location, role.mode].filter(Boolean).join(SEP);
                return (
                  <li key={role.id} className={styles.role}>
                    <div className={styles.roleHead}>
                      <h3 className={styles.roleTitle}>{role.title}</h3>
                      <p className={styles.roleCompany}>{role.company}</p>
                    </div>
                    <div className={styles.roleWhen}>
                      <p className={styles.roleDates}>
                        <time dateTime={role.start}>{formatMonthYear(role.start, locale)}</time>
                        {' – '}
                        {role.end ? <time dateTime={role.end}>{formatMonthYear(role.end, locale)}</time> : present}
                      </p>
                      {place ? <p className={styles.rolePlace}>{place}</p> : null}
                    </div>
                    {role.highlights.length ? (
                      <ul className={styles.highlights} role="list">
                        {role.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </SectionPanel>
        ) : null}

        {projects.length ? (
          <SectionPanel id="projects" number={number('projects')} label={ui.sections.projects}>
            <ul className={styles.projects} role="list">
              {projects.map((project) => {
                const caseUrl = project.slug ? absoluteUrl(`/${locale}/work/${project.slug}`) : null;
                return (
                  <li key={project.key} className={styles.project}>
                    <h3 className={styles.projectName}>{project.name}</h3>
                    {project.summary ? <p className={styles.projectSummary}>{project.summary}</p> : null}
                    {caseUrl ? (
                      <p className={styles.projectLink}>
                        <Link href={`/work/${project.slug}`} className={styles.more} data-print="hide">
                          {label(ui.caseStudy, FALLBACK_UI.caseStudy)}
                          <span className="visually-hidden">: {project.name}</span>
                          <Icon name="arrow-right" size={14} className={styles.moreIcon} />
                        </Link>
                        <a href={caseUrl} className={styles.printUrl}>
                          <bdi dir="ltr">{displayUrl(caseUrl)}</bdi>
                        </a>
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </SectionPanel>
        ) : null}

        {factsCount ? (
          <div className={cx(styles.facts, styles[`facts${factsCount}`])}>
            {hasEducation ? (
              <SectionPanel id="education" number={number('education')} label={ui.sections.education}>
                <div className={styles.education}>
                  {education.degree ? <h3 className={styles.itemTitle}>{education.degree}</h3> : null}
                  {education.school ? <p className={styles.itemOrg}>{education.school}</p> : null}
                  {education.location || education.year ? (
                    <p className={styles.itemMeta}>
                      {[education.location, education.year].filter(Boolean).join(SEP)}
                    </p>
                  ) : null}
                </div>
              </SectionPanel>
            ) : null}

            {certifications.length ? (
              <SectionPanel id="certifications" number={number('certifications')} label={ui.sections.certifications} delay={60}>
                <ul className={styles.certs} role="list">
                  {certifications.map((item) => (
                    <li key={item} className={styles.cert}>
                      <Icon name="award" size={18} className={styles.certIcon} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </SectionPanel>
            ) : null}

            {languages.length ? (
              <SectionPanel id="languages" number={number('languages')} label={ui.sections.languages} delay={120}>
                <ul className={cx(styles.chips, styles.languages)} role="list">
                  {languages.map((item) => (
                    <li key={item} className={styles.chip}>
                      {item}
                    </li>
                  ))}
                </ul>
              </SectionPanel>
            ) : null}
          </div>
        ) : null}
      </article>
    </div>
  );
}
