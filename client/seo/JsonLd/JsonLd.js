/**
 * JsonLd — schema.org structured data as <script type="application/ld+json">. Server component.
 *
 * export default async function JsonLd({ kind, locale, slug })
 *   kind    'person' (home, résumé) | 'case' (case study)
 *   locale  "en" | "ar"
 *   slug    project slug (kind 'case' only)
 *
 * Person:       name, alternateName (other-locale name + handle), jobTitle, description, url, image (portrait),
 *               email, telephone, address (Riyadh, SA), sameAs (LinkedIn, GitHub), knowsLanguage, alumniOf,
 *               knowsAbout. One stable @id, so every page describes the same person.
 * CreativeWork: name, description, image (cover), url, inLanguage, keywords (stack), about (category),
 *               author (that Person, by @id).
 *
 * Facts come only from content/*.js (OWNER.md); wording from messages (meta, projects). Placeholder
 * ("TODO…") and empty strings are dropped, never published. The JSON is escaped so that no "<", ">" or "&"
 * can end the script element or open a comment, and U+2028/2029 cannot break a parser.
 */
import { getMessages } from 'next-intl/server';
import { site } from '../../../content/site';
import { getProject } from '../../../content/projects';
import { absoluteUrl } from '../../../lib/site';

// OWNER.md: English, Urdu, Hindi, basic Arabic. Names are localised with Intl.DisplayNames.
const LANGUAGE_CODES = ['en', 'ur', 'hi', 'ar'];
// OWNER.md: Master of Information Technology — Lahore Leads University, Pakistan — 2015.
const SCHOOL_COUNTRY = 'PK';

export const PERSON_ID = `${site.url}/#person`;

const text = (value) => (typeof value === 'string' && value.trim() && !/^TODO\b/i.test(value.trim()) ? value.trim() : '');
const texts = (list) => (Array.isArray(list) ? list.map(text).filter(Boolean) : []);

/** Serialises for an inline <script>: valid JSON that cannot close the element or start an HTML comment. */
export function serializeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function languageName(code, locale) {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(code) || code;
  } catch {
    return code;
  }
}

function person(locale, messages) {
  const meta = messages.meta ?? {};
  const name = site.name[locale] ?? site.name.en;
  const otherNames = Object.values(site.name).filter((value) => value !== name);
  const topics = texts(meta.knowsAbout);

  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name,
    alternateName: [...otherNames, site.handle],
    jobTitle: text(meta.jobTitle) || 'Senior UI/UX Designer',
    description: text(meta.home?.description) || undefined,
    url: absoluteUrl(`/${locale}`),
    image: absoluteUrl(site.portrait.src),
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.city,
      addressCountry: site.location.countryCode,
    },
    sameAs: [site.social.linkedin, site.social.github],
    knowsLanguage: LANGUAGE_CODES.map((code) => ({
      '@type': 'Language',
      name: languageName(code, locale),
      alternateName: code,
    })),
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: site.education.school,
      address: { '@type': 'PostalAddress', addressCountry: SCHOOL_COUNTRY },
    },
    knowsAbout: topics.length ? topics : undefined,
  };
}

function creativeWork(locale, slug, messages) {
  const project = getProject(slug);
  if (!project) return null;

  const item = messages.projects?.items?.[slug] ?? {};
  const name = text(item.title) || slug;
  const description = text(item.summary) || text(item.headline) || text(messages.meta?.work?.descriptionFallback);
  const url = absoluteUrl(`/${locale}/work/${slug}`);

  return {
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    name,
    description: description || undefined,
    about: text(item.category) || undefined,
    image: absoluteUrl(project.cover.src),
    url,
    inLanguage: locale,
    keywords: project.stack.join(', '),
    author: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: site.name[locale] ?? site.name.en,
      url: absoluteUrl(`/${locale}`),
    },
  };
}

export default async function JsonLd({ kind, locale, slug }) {
  const messages = await getMessages({ locale });
  const entity = kind === 'person' ? person(locale, messages) : kind === 'case' ? creativeWork(locale, slug, messages) : null;
  if (!entity) return null;

  const data = { '@context': 'https://schema.org', ...entity };
  // JSON.stringify drops the `undefined` fields (unknown facts stay out).
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
