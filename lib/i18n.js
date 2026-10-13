/**
 * Locale helpers that work on the server and the client (no next-intl dependency).
 * Numbers and dates always use Latin digits — in Arabic too (CONTRACT §0.4).
 */

const RTL_LOCALES = new Set(["ar"]);

/** True for right-to-left locales. */
export const isRtl = (locale) => RTL_LOCALES.has(locale);

/** Value for <html dir>: "rtl" | "ltr". */
export const dir = (locale) => (isRtl(locale) ? "rtl" : "ltr");

/**
 * BCP 47 tag for Intl.* formatters: localeTag("ar") → "ar-u-nu-latn" (Arabic with Latin digits),
 * localeTag("en") → "en". Use it instead of the raw locale whenever you format numbers or dates.
 */
export const localeTag = (locale) => (locale === "ar" ? "ar-u-nu-latn" : "en");

/** OpenGraph locale: "ar_SA" | "en_US". */
export const ogLocale = (locale) => (locale === "ar" ? "ar_SA" : "en_US");

/** Parses "YYYY-MM", "YYYY-MM-DD" or a Date into a Date at UTC midnight; invalid → Invalid Date. */
function toUtcDate(value) {
  if (value instanceof Date) return value;
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(value ?? ""));
  if (!match) return new Date(NaN);
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3] ?? 1)));
}

/**
 * Month + year: formatMonthYear("2024-06", "en") → "Jun 2024"; in "ar" → "يونيو 2024".
 * Returns "" for missing/invalid input. Pass { month: "long" } for "June 2024".
 */
export function formatMonthYear(date, locale, { month = "short" } = {}) {
  const value = toUtcDate(date);
  if (Number.isNaN(value.getTime())) return "";
  return new Intl.DateTimeFormat(localeTag(locale), { month, year: "numeric", timeZone: "UTC" }).format(value);
}

/**
 * Role/date range: formatMonthRange("2024-06", null, "en", "Present") → "Jun 2024 – Present".
 * `presentLabel` comes from messages (e.g. home.experience.present).
 */
export function formatMonthRange(start, end, locale, presentLabel, options) {
  const from = formatMonthYear(start, locale, options);
  const to = end ? formatMonthYear(end, locale, options) : presentLabel;
  return [from, to].filter(Boolean).join(" – ");
}

/** Number formatting with Latin digits in every locale. */
export function formatNumber(value, locale, options) {
  return new Intl.NumberFormat(localeTag(locale), options).format(value);
}
