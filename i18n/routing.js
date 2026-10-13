import { defineRouting } from "next-intl/routing";

/**
 * Locale routing shared by the middleware, navigation helpers and request config.
 * Every URL carries its locale prefix: /en/…, /ar/…
 */
export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});
