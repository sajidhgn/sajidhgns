import { site } from "../content/site";

/**
 * Whole years since site.careerStart, rounded down (2017-01-01 → 9 during 2026).
 * Use this everywhere a "years of experience" number is shown; never hardcode it.
 */
export function yearsOfExperience(now = new Date()) {
  const start = new Date(`${site.careerStart}T00:00:00Z`);
  let years = now.getUTCFullYear() - start.getUTCFullYear();
  const anniversary = Date.UTC(now.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  if (now.getTime() < anniversary) years -= 1;
  return Math.max(0, years);
}

/** Absolute URL on the production origin: absoluteUrl("/en/resume") → "https://sajidhgn.vercel.app/en/resume". */
export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
