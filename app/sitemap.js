/**
 * /sitemap.xml — every public route in every locale, each with its hreflang alternates (en, ar, x-default).
 * Absolute URLs on the production origin (content/site.js → url). Legacy /[locale]/project/<id> URLs are
 * permanent redirects and are deliberately not listed.
 *
 * lastModified: the build (the site is statically generated, so a deploy is when pages change), except the
 * legal pages, which carry their own "Last updated" date (messages/<locale>/legal.json → updated).
 */
import { routing } from '../i18n/routing';
import { projectSlugs } from '../content/projects';
import { absoluteUrl } from '../lib/site';
import legalEn from '../messages/en/legal.json';
import legalAr from '../messages/ar/legal.json';

const LEGAL = { en: legalEn, ar: legalAr };

const ROUTES = [
  { path: '' },
  { path: '/work' },
  ...projectSlugs.map((slug) => ({ path: `/work/${slug}` })),
  { path: '/resume' },
  { path: '/privacy', legal: true },
  { path: '/terms', legal: true },
];

/** "YYYY-MM-DD" → Date (UTC midnight); anything else → null. */
function parseDay(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? ''));
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function sitemap() {
  const built = new Date();

  return ROUTES.flatMap(({ path, legal }) => {
    const languages = Object.fromEntries(routing.locales.map((code) => [code, absoluteUrl(`/${code}${path}`)]));
    languages['x-default'] = absoluteUrl(`/${routing.defaultLocale}${path}`);

    return routing.locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified: (legal && parseDay(LEGAL[locale]?.updated)) || built,
      alternates: { languages },
    }));
  });
}
