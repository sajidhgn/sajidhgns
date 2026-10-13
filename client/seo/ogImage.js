/**
 * The site's default social card (app/[locale]/opengraph-image.js), as a metadata image for buildMetadata().
 *
 *   buildMetadata({ locale, path: '/resume', title, description, image: ogImage(locale) })
 *
 * Why pages need it: Next.js merges `openGraph` shallowly, so a page whose metadata sets `openGraph` (every
 * buildMetadata() call does) drops the file-based image it would inherit from app/[locale]/. Passing this
 * puts it back. The URL is resolved against metadataBase (the production origin).
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = 'image/jpeg';

// English on purpose: the card itself is English in both locales (its font has no Arabic glyphs).
export const OG_ALT = 'Sajid Ali — Senior UI/UX Designer in Riyadh, Saudi Arabia. Available for new opportunities.';

/** { url: "/en/opengraph-image", width, height, alt, type } */
export function ogImage(locale) {
  return { url: `/${locale}/opengraph-image`, ...OG_SIZE, alt: OG_ALT, type: OG_TYPE };
}
