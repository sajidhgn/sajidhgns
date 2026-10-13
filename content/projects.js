/**
 * Project structure (locale-independent). All text — title, category, summary, case-study
 * blocks, figure alt text and captions — lives in messages/<locale>/projects.json → items.<slug>.
 *
 * Fields
 *   slug      URL segment: /[locale]/work/<slug>
 *   legacyId  old /[locale]/project/<id> URL → permanent redirect to the slug
 *   featured  true → "Selected work" (full case study); false → "More work" (brief)
 *   order     global display order (featured first)
 *   liveUrl   public URL or null (no public build / broken link)
 *   year      null = unknown (never guess)
 *   cover     16:10 crop from the top of a screenshot (public/images/project/covers/<slug>.jpg);
 *             `position` is a CSS object-position for frames that are not 16:10
 *   figures   semantic key → { src, width, height }. Keys are referenced from
 *             projects.json (blocks[].figure, gallery figures, figures.<key>.alt/caption).
 *             What each image shows: see FIGURES.md in the build notes.
 *   stack     technology labels (proper nouns, not translated)
 *
 * Every width/height below is the file's real pixel size (read with sharp).
 */

const img = (src, width, height) => ({ src, width, height });

const covers = {
  rawbit: img("/images/project/covers/rawbit.jpg", 1440, 900),
  healthsia: img("/images/project/covers/healthsia.jpg", 1480, 925),
  ounlab: img("/images/project/covers/ounlab.jpg", 1077, 673),
  workinaus: img("/images/project/covers/workinaus.jpg", 1000, 625),
  eduhub: img("/images/project/covers/eduhub.jpg", 832, 520),
  shahjee: img("/images/project/covers/shahjee.jpg", 1077, 673),
  peepskill: img("/images/project/covers/peepskill.jpg", 1600, 1000),
  learninghub: img("/images/project/covers/learninghub.jpg", 760, 475),
  royalvision: img("/images/project/covers/royalvision.jpg", 949, 593),
  papaz: img("/images/project/covers/papaz.jpg", 1248, 780),
  mdhov: img("/images/project/covers/mdhov.jpg", 1077, 673),
};

const hs = (n, ext, width, height) => img(`/images/project/healthsia/health-(${n}).${ext}`, width, height);

export const projects = [
  {
    slug: "rawbit",
    legacyId: null,
    featured: true,
    order: 1,
    liveUrl: "https://therawbit.ai",
    year: 2026,
    cover: { ...covers.rawbit, position: "top" },
    figures: {
      cover: covers.rawbit,
      full: img("/images/project/rawbit.jpg", 1440, 2300),
      "studio-ar": img("/images/project/rawbit-ar.jpg", 1440, 900),
    },
    stack: ["React", "Node.js", "PostgreSQL", "pgvector", "WebSockets", "LLM APIs", "Moyasar", "N-Genius", "ZATCA"],
  },
  {
    slug: "healthsia",
    legacyId: 10,
    featured: true,
    order: 2,
    liveUrl: null,
    year: null,
    cover: { ...covers.healthsia, position: "left top" },
    figures: {
      cover: covers.healthsia,
      // Web admin console
      "signin-roles": hs(1, "jpeg", 1755, 867),
      "dashboard-light": hs(19, "png", 1917, 925),
      "dashboard-dark": hs(18, "png", 1920, 1132),
      countries: hs(20, "png", 1920, 927),
      races: hs(21, "png", 1920, 927),
      clinics: hs(22, "png", 1920, 921),
      "clinic-admins": hs(23, "png", 1920, 931),
      specializations: hs(24, "png", 1918, 927),
      admins: hs(25, "png", 1912, 926),
      "admin-create-permissions": hs(26, "png", 1920, 1417),
      nutritionists: hs(6, "png", 1920, 1136),
      "nutritionist-create-wizard": hs(7, "png", 1920, 2265),
      therapists: hs(17, "png", 1920, 1136),
      "therapist-detail": hs(15, "png", 1920, 1692),
      "therapist-edit-address": hs(16, "png", 1920, 2270),
      patients: hs(8, "png", 1920, 960),
      "search-by-therapists": hs(14, "png", 1920, 1251),
      exercises: hs(2, "png", 1920, 1001),
      "food-items": hs(4, "png", 1920, 1013),
      "food-item-create": hs(5, "png", 1920, 1491),
      "food-item-detail": hs(3, "png", 1920, 1331),
      questionnaires: hs(10, "png", 1920, 1015),
      "questionnaire-categories": hs(11, "png", 1920, 1015),
      "questionnaire-builder": hs(12, "png", 1920, 988),
      "questionnaire-detail": hs(9, "png", 1920, 1792),
      "surgery-questionnaires": hs(13, "png", 1920, 1072),
      // Patient mobile app (portrait marketing screens; 31–33 are low resolution)
      "app-splash": hs(27, "png", 1242, 2688),
      "app-onboarding-health-journey": hs(28, "png", 1242, 2688),
      "app-onboarding-every-log-matters": hs(29, "png", 1242, 2688),
      "app-onboarding-care-plan": hs(30, "png", 1242, 2688),
      "app-onboarding-track-activities": hs(31, "png", 273, 592),
      "app-onboarding-appointments": hs(32, "png", 273, 592),
      "app-onboarding-stay-connected": hs(33, "png", 273, 592),
    },
    stack: ["React", "Next.js", "Node.js", "Express", "MySQL", "Sequelize", "Socket.io"],
  },
  {
    slug: "ounlab",
    legacyId: 6,
    featured: true,
    order: 3,
    liveUrl: "https://oun.ai",
    year: null,
    cover: { ...covers.ounlab, position: "top" },
    figures: {
      cover: covers.ounlab,
      full: img("/images/project/ounlab.png", 1086, 2277),
    },
    stack: ["React", "Next.js", "Node.js", "Tailwind CSS", "Redux Toolkit", "WebSockets", "Stripe"],
  },
  {
    slug: "workinaus",
    legacyId: 1,
    featured: true,
    order: 4,
    liveUrl: "https://workinaus.com.au/",
    year: null,
    cover: { ...covers.workinaus, position: "top" },
    figures: {
      cover: covers.workinaus,
      full: img("/images/project/workinaus.png", 1086, 2209),
    },
    stack: ["React", "Next.js", "Redux", "Bootstrap", "Elasticsearch"],
  },
  {
    slug: "eduhub",
    legacyId: 7,
    featured: true,
    order: 5,
    liveUrl: "https://eduhubpak.com/",
    year: null,
    cover: { ...covers.eduhub, position: "top" },
    figures: {
      cover: covers.eduhub,
      full: img("/images/project/eduhub.png", 1086, 7048),
    },
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GraphQL", "Headless WordPress", "WPGraphQL"],
  },
  {
    slug: "shahjee",
    legacyId: 4,
    featured: false,
    order: 6,
    liveUrl: "https://shahjeepetroleum.com/",
    year: null,
    cover: { ...covers.shahjee, position: "left top" },
    figures: {
      cover: covers.shahjee,
      full: img("/images/project/pms.png", 1086, 673),
    },
    stack: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    slug: "peepskill",
    legacyId: 3,
    featured: false,
    order: 7,
    liveUrl: "http://peepskill.com/",
    year: null,
    cover: { ...covers.peepskill, position: "top" },
    figures: {
      cover: covers.peepskill,
      full: img("/images/project/peepskill.png", 2880, 4792),
    },
    stack: ["React", "Next.js", "Tailwind CSS", "WebSockets", "Node.js", "Express", "MySQL"],
  },
  {
    slug: "learninghub",
    legacyId: 2,
    featured: false,
    order: 8,
    liveUrl: null,
    year: null,
    cover: { ...covers.learninghub, position: "left top" },
    figures: {
      cover: covers.learninghub,
      full: img("/images/project/tvhub.png", 1086, 3126),
    },
    stack: ["React", "Next.js", "Redux Toolkit", "Bootstrap", "Stripe"],
  },
  {
    slug: "royalvision",
    legacyId: 5,
    featured: false,
    order: 9,
    liveUrl: "https://www.royalvisiondubai.com/",
    year: null,
    cover: { ...covers.royalvision, position: "top" },
    figures: {
      cover: covers.royalvision,
      full: img("/images/project/travel.png", 1086, 4223),
    },
    stack: ["React", "Next.js", "Tailwind CSS", "React Query"],
  },
  {
    slug: "papaz",
    legacyId: 8,
    featured: false,
    order: 10,
    liveUrl: null,
    year: null,
    cover: { ...covers.papaz, position: "left top" },
    figures: {
      cover: covers.papaz,
      full: img("/images/project/papaz.jpg", 1854, 927),
    },
    stack: ["React", "Electron", "Tailwind CSS"],
  },
  {
    slug: "mdhov",
    legacyId: 9,
    featured: false,
    order: 11,
    liveUrl: "https://www.mdhov.com/",
    year: null,
    cover: { ...covers.mdhov, position: "top" },
    figures: {
      cover: covers.mdhov,
      full: img("/images/project/mdhov.png", 1086, 3087),
    },
    stack: ["HTML5", "CSS", "Bootstrap", "WordPress", "AJAX", "Laravel"],
  },
];

const byOrder = (a, b) => a.order - b.order;

/** All slugs, in display order (for generateStaticParams and the sitemap). */
export const projectSlugs = [...projects].sort(byOrder).map((project) => project.slug);

/** Featured projects in display order: rawbit, healthsia, ounlab, workinaus, eduhub. */
export const featuredProjects = projects.filter((project) => project.featured).sort(byOrder);

/** "More work" in display order: shahjee, peepskill, learninghub, royalvision, papaz, mdhov. */
export const moreProjects = projects.filter((project) => !project.featured).sort(byOrder);

/** Project by slug, or null. */
export const getProject = (slug) => projects.find((project) => project.slug === slug) ?? null;

/** Project by legacy numeric id (number or digit string from the URL), or null. */
export const getProjectByLegacyId = (id) => {
  const value = typeof id === "number" ? id : /^\d{1,4}$/.test(String(id)) ? Number(id) : NaN;
  return projects.find((project) => project.legacyId === value) ?? null;
};

/** The project after `slug` in display order (wraps around), for "Next case study". */
export const getNextProject = (slug) => {
  const index = projectSlugs.indexOf(slug);
  if (index === -1) return null;
  return getProject(projectSlugs[(index + 1) % projectSlugs.length]);
};
