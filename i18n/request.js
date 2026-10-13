import { getRequestConfig } from "next-intl/server";
import { loadMessages } from "./messages";
import { routing } from "./routing";

/**
 * Per-request next-intl configuration (picked up by createNextIntlPlugin in next.config.js).
 * Pages and layouts must call `setRequestLocale(locale)` before using translations so that
 * they stay statically renderable.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await loadMessages(locale),
    // Fixed zone so server- and client-rendered dates agree (the owner is based in Riyadh).
    timeZone: "Asia/Riyadh",
  };
});
