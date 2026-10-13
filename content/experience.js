/**
 * Roles, newest first. Structure only — the REAL job titles, locations, summaries and
 * highlights live in messages/<locale>/experience.json → roles.<id>.
 *
 * start / end: "YYYY-MM" (end: null = present). mode: "onsite" | "remote" | "hybrid".
 * Logos are square: 1.jpeg 100×100, 2.png 225×225, 3.jpeg 200×200, 4.png 225×225,
 * 5.jpeg 200×200 (5.jpeg has a dark background), rawbit.png 250×250 (Rawbit mark at 80% on white, from rawbit-icon-250.png).
 */
export const roles = [
  { id: "rawstudio", company: "Raw Studio", url: null, logo: "/images/work/rawbit.png", start: "2026-05", end: null, mode: "onsite" },
  { id: "oxcoders", company: "OxCoders", url: null, logo: "/images/work/1.jpeg", start: "2024-06", end: "2026-05", mode: "onsite" },
  { id: "dycoders", company: "Dycoders", url: "https://dycoders.com/", logo: "/images/work/2.png", start: "2023-07", end: "2024-05", mode: "remote" },
  { id: "tanbits", company: "Tanbits", url: "https://tanbits.com/", logo: "/images/work/3.jpeg", start: "2021-08", end: "2023-06", mode: "onsite" },
  { id: "mdhov", company: "Mdhov", url: "https://www.mdhov.com/", logo: "/images/work/4.png", start: "2019-07", end: "2021-07", mode: "remote" },
  { id: "teambee", company: "Teambee Designers", url: null, logo: "/images/work/5.jpeg", start: "2017-01", end: "2019-07", mode: "onsite" },
];

export const getRole = (id) => roles.find((role) => role.id === id) ?? null;
