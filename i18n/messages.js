import { routing } from "./routing";

/**
 * Message namespaces. Each one is a file: messages/<locale>/<namespace>.json
 * (the file name IS the namespace — no wrapping key). See CONTRACT §3.
 */
export const namespaces = [
  "layout",
  "work",
  "contact",
  "case",
  "resumeUi",
  "meta",
  "home",
  "experience",
  "projects",
  "resume",
  "legal",
];

/**
 * UI namespaces that client components may read. Only these are passed to
 * NextIntlClientProvider — the long-form content namespaces stay on the server.
 */
export const clientNamespaces = ["layout", "contact", "work", "case", "resumeUi"];

/**
 * Loads every namespace file for a locale and returns `{ [namespace]: json }`.
 * Unknown locales fall back to the default locale. Server-only: importing this
 * from a client component would bundle every message file.
 */
export async function loadMessages(locale) {
  const safeLocale = routing.locales.includes(locale) ? locale : routing.defaultLocale;
  const entries = await Promise.all(
    namespaces.map(async (namespace) => {
      const file = await import(`../messages/${safeLocale}/${namespace}.json`);
      return [namespace, file.default];
    })
  );
  return Object.fromEntries(entries);
}

/**
 * Returns only the given namespaces of a messages object, e.g. for the client provider:
 *   <NextIntlClientProvider messages={pickMessages(await getMessages())}>
 */
export function pickMessages(messages, keys = clientNamespaces) {
  return Object.fromEntries(keys.filter((key) => key in messages).map((key) => [key, messages[key]]));
}
