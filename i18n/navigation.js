import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation. Use this `Link` for every internal link:
 *   <Link href="/resume">…</Link>                → /en/resume or /ar/resume
 *   <Link href={pathname} locale="ar">العربية</Link>  → language switch
 * `redirect` / `permanentRedirect` take `{ href, locale }`.
 */
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
