/**
 * /robots.txt — every crawler may index the whole site; the sitemap lives on the production origin.
 * /api/ (the contact form's POST-only endpoint) has nothing to index, so crawlers are asked to skip it.
 */
import { site } from '../content/site';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
