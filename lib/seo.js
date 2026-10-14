import { site } from "../content/site";
import { routing } from "../i18n/routing";
import { ogLocale } from "./i18n";

/** "" for the locale root, otherwise "/segment[/segment]" without a trailing slash. */
function normalizePath(path = "") {
  const trimmed = String(path).trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

/**
 * Builds a Next.js Metadata object for a localized route.
 *
 *   export async function generateMetadata({ params: { locale } }) {
 *     const t = await getTranslations({ locale, namespace: "meta" });
 *     return buildMetadata({ locale, path: "/resume", title: t("resume.title"), description: t("resume.description") });
 *   }
 *
 * @param {object} args
 * @param {string} args.locale        "en" | "ar"
 * @param {string} [args.path]        route path WITHOUT the locale prefix: "" (home), "/resume", "/work/healthsia"
 * @param {string} args.title         complete document title — used as-is (a layout title template does not apply)
 * @param {string} args.description
 * @param {string|{url: string, width?: number, height?: number, alt?: string}} [args.image]
 *        OpenGraph/Twitter image. Omit it to fall back to the file-based opengraph-image of the route.
 * @param {"website"|"article"|"profile"} [args.type]
 * @param {boolean} [args.noIndex]    true → robots noindex (e.g. the 404 page); otherwise an explicit index, follow
 */
export function buildMetadata({ locale, path = "", title, description, image, type = "website", noIndex = false }) {
  const route = normalizePath(path);
  const url = `/${locale}${route}`;

  const languages = Object.fromEntries(routing.locales.map((code) => [code, `/${code}${route}`]));
  languages["x-default"] = `/${routing.defaultLocale}${route}`;

  const images = image ? [typeof image === "string" ? { url: image } : image] : undefined;
  const siteName = site.name[locale] ?? site.name.en;

  return {
    metadataBase: new URL(site.url),
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type,
      url,
      siteName,
      title,
      description,
      locale: ogLocale(locale),
      alternateLocale: routing.locales.filter((code) => code !== locale).map(ogLocale),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((entry) => entry.url) } : {}),
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
        },
  };
}
