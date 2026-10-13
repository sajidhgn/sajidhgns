/**
 * Case-study content (server only) — one normalised, request-cached view of a project for every
 * client/case-study component. Structure comes from content/projects.js, text from
 * messages/<locale>/projects.json → items.<slug> (SCHEMA.md), UI labels from messages/<locale>/case.json.
 *
 *   const data = await getCase(slug, locale);   // null for an unknown slug
 *   data.title, data.category, data.headline, data.summary, data.liveUrl
 *   data.meta     [{ id, label, value, icon }]        non-empty fields only (Role, Platform, Industry, Timeline, Team)
 *   data.stack    ['React', …]
 *   data.tldr     [{ id, label, body, icon }]         non-empty only
 *   data.heroKey  figure shown in the cover panel ('full' when the project has one, else 'cover')
 *   data.figure(key) → resolved figure or null        (see resolveFigure)
 *   data.blocks   normalised blocks (CONTRACT §4) — unknown types and empty blocks are dropped; titled
 *                 blocks carry { label, heading, number, anchor } (numbers start at 02 when TL;DR shows)
 *   data.closingNumbers  { next, contact } — the eyebrow numbers of the two closing panels
 *
 * Robustness rule (CONTRACT §0.1, §4): missing or empty values render nothing; never invent text.
 */
import { cache } from 'react';
import { getMessages, getTranslations } from 'next-intl/server';
import { getProject } from '../../content/projects';

// ---------------------------------------------------------------------------------------------
// Figure hints (FIGURES.md). content/projects.js may later carry these as `figures.<key>.testData`
// / `.kind`; those values win over the lists below.
// ---------------------------------------------------------------------------------------------

/**
 * Screens that show test or sample records — rendered with a "Shown with test data" note. Captions that
 * already end with that sentence (case.figure.testDataPhrases) get the note too, and lose the sentence.
 * (ShahJee and PeepSkill captions say "sample data" / "sample posts" in their own words, so no note.)
 */
const TEST_DATA = {
  healthsia: new Set([
    'cover', // crop of dashboard-light: small sample counts
    'dashboard-light',
    'dashboard-dark',
    'clinics',
    'clinic-admins',
    'admins',
    'nutritionists',
    'therapists',
    'therapist-detail',
    'therapist-edit-address',
    'search-by-therapists',
    'food-items',
    'food-item-detail',
    'app-onboarding-health-journey',
    'app-onboarding-every-log-matters',
    'app-onboarding-care-plan',
    'app-onboarding-track-activities',
    'app-onboarding-appointments',
    'app-onboarding-stay-connected',
  ]),
};

/** Portrait phone screens: shown in a device-style card, never in browser chrome. */
const MOBILE = {
  healthsia: new Set([
    'app-splash',
    'app-onboarding-health-journey',
    'app-onboarding-every-log-matters',
    'app-onboarding-care-plan',
    'app-onboarding-track-activities',
    'app-onboarding-appointments',
    'app-onboarding-stay-connected',
  ]),
};

/** Taller than this (height / width) → a full-page capture, shown in a fixed-height scrollable frame. */
const TALL_RATIO = 1.1;
/** FIGURES.md: the 1086-px `full` captures include a 9-px browser scrollbar track on the right edge. */
const SCROLLBAR_CAPTURE_WIDTH = 1086;
const SCROLLBAR_TRACK = 9;
/** Below this natural width an image is low resolution (FIGURES.md: "show small"). */
const LOW_RES_WIDTH = 600;

// ---------------------------------------------------------------------------------------------
// Small readers — every value from messages goes through these.
// ---------------------------------------------------------------------------------------------

const str = (value) => (typeof value === 'string' ? value.trim() : '');
const strings = (value) => {
  if (typeof value === 'string') return value.trim() ? [value.trim()] : [];
  return Array.isArray(value) ? value.map(str).filter(Boolean) : [];
};
const same = (a, b) => a.toLocaleLowerCase() === b.toLocaleLowerCase();
const pad2 = (n) => String(n).padStart(2, '0');

/** "Clinics list. Shown with test data." → { caption: "Clinics list.", found: true } (whole sentences only). */
const sentenceKey = (value) => value.replace(/[\s.!?؟。…]+$/u, '').trim().toLocaleLowerCase();
function takeTestNote(caption, phrases) {
  if (!caption || !phrases.length) return { caption, found: false };
  const targets = new Set(phrases.map(sentenceKey).filter(Boolean));
  const sentences = caption.split(/(?<=[.!?؟。])\s+/u);
  const kept = sentences.filter((sentence) => !targets.has(sentenceKey(sentence)));
  return { caption: kept.join(' ').trim(), found: kept.length < sentences.length };
}

const META_FIELDS = [
  { id: 'role', icon: 'user' },
  { id: 'platform', icon: 'monitor' },
  { id: 'industry', icon: 'briefcase' },
  { id: 'timeline', icon: 'calendar' },
  { id: 'team', icon: 'users' },
];

const TLDR_FIELDS = [
  { id: 'problem', icon: 'target' },
  { id: 'approach', icon: 'pen-tool' },
  { id: 'impact', icon: 'chart' },
];

/** Block types whose panel gets a numbered eyebrow (figure and quote panels are unnumbered). */
const TITLED = new Set(['text', 'list', 'cards', 'steps', 'decisions', 'gallery', 'metrics']);

/** Arabic letters → the text sets its own direction; otherwise numbers/symbols stay LTR ("~40%"). */
export const isArabicText = (value) => /[؀-ۿݐ-ݿࢠ-ࣿ]/.test(value);

/**
 * Resolves a figure key against content/projects.js + the localized alt/caption.
 * Returns null when the key has no image (never render a broken <img>).
 */
function resolveFigure(project, textFigures, key, fallbackAlt, notePhrases) {
  const image = key ? project.figures?.[key] : null;
  if (!image?.src || !image.width || !image.height) return null;
  const text = textFigures?.[key] && typeof textFigures[key] === 'object' ? textFigures[key] : {};
  const ratio = image.height / image.width;
  const mobile = image.kind ? image.kind === 'mobile' : Boolean(MOBILE[project.slug]?.has(key));
  const trim = image.trim ?? (image.width === SCROLLBAR_CAPTURE_WIDTH ? SCROLLBAR_TRACK : 0);
  const { caption, found } = takeTestNote(str(text.caption), notePhrases);

  return {
    key,
    src: image.src,
    width: image.width,
    height: image.height,
    alt: str(text.alt) || fallbackAlt,
    caption,
    testData: image.testData ?? (found || Boolean(TEST_DATA[project.slug]?.has(key))),
    kind: mobile ? 'mobile' : ratio >= TALL_RATIO ? 'page' : 'screen',
    trim,
    lowRes: image.width < LOW_RES_WIDTH,
  };
}

function normalizeItems(value, fields) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => Object.fromEntries(fields.map((field) => [field, str(item[field])])));
}

/** One raw block → a normalised block, or null when it is unknown or would render nothing. */
function normalizeBlock(raw, figure, skip) {
  if (!raw || typeof raw !== 'object') return null;
  const base = { type: raw.type, id: str(raw.id), title: str(raw.title) };
  const usable = (key) => !skip.has(key) && figure(key);

  switch (raw.type) {
    case 'text': {
      const body = strings(raw.body);
      return body.length ? { ...base, body } : null;
    }
    case 'list': {
      const intro = str(raw.intro);
      const items = strings(raw.items);
      return intro || items.length ? { ...base, intro, items } : null;
    }
    case 'cards':
    case 'steps': {
      const items = normalizeItems(raw.items, ['title', 'body', 'icon']).filter((item) => item.title || item.body);
      return items.length ? { ...base, items } : null;
    }
    case 'decisions': {
      const items = normalizeItems(raw.items, ['title', 'problem', 'decision', 'tradeoff', 'figure'])
        .filter((item) => item.problem || item.decision || item.tradeoff)
        .map((item) => ({ ...item, figure: usable(item.figure) ? item.figure : '' }));
      return items.length ? { ...base, items } : null;
    }
    case 'figure': {
      const key = str(raw.figure);
      return usable(key) ? { ...base, figure: key } : null;
    }
    case 'gallery': {
      const keys = [...new Set(strings(raw.figures))].filter(usable);
      return keys.length ? { ...base, figures: keys } : null;
    }
    case 'metrics': {
      const items = normalizeItems(raw.items, ['value', 'label', 'icon']).filter((item) => item.value);
      const body = strings(raw.body);
      return items.length || body.length ? { ...base, items, body } : null;
    }
    case 'quote': {
      const text = str(raw.text);
      return text ? { ...base, text, cite: str(raw.cite) } : null;
    }
    default:
      return null; // unknown block type → ignored (CONTRACT §4)
  }
}

/**
 * The normalised case study for (slug, locale), cached per request so every component on the page
 * shares one copy. Unknown slug → null.
 */
export const getCase = cache(async (slug, locale) => {
  const project = getProject(slug);
  if (!project) return null;

  const [messages, t] = await Promise.all([
    getMessages({ locale }),
    getTranslations({ locale, namespace: 'case' }),
  ]);
  const item = messages?.projects?.items?.[slug];
  const text = item && typeof item === 'object' ? item : {};
  const ui = messages?.case && typeof messages.case === 'object' ? messages.case : {};
  const label = (key, values) => (t.has(key) ? t(key, values) : '');

  const title = str(text.title) || slug;
  const fallbackAlt = label('figure.fallbackAlt', { title }) || title;
  const textFigures = text.figures && typeof text.figures === 'object' ? text.figures : {};
  const notePhrases = [...new Set([label('figure.testData'), ...strings(ui.figure?.testDataPhrases)].filter(Boolean))];
  const resolved = new Map();
  const figure = (key) => {
    if (!key) return null;
    if (!resolved.has(key)) resolved.set(key, resolveFigure(project, textFigures, key, fallbackAlt, notePhrases));
    return resolved.get(key);
  };

  // The cover panel shows the full-page capture when there is one, else the cover crop. Covers are crops
  // of the same screenshots (FIGURES.md), so neither appears again further down the page.
  const heroKey = figure('full') ? 'full' : 'cover';
  const shown = new Set(heroKey === 'full' ? ['full', 'cover'] : ['cover']);

  const meta = META_FIELDS.map((field) => ({
    ...field,
    label: label(`meta.${field.id}`),
    value: str(text.meta?.[field.id]),
  })).filter((field) => field.value && field.label);

  const tldr = TLDR_FIELDS.map((field) => ({
    ...field,
    label: label(`tldr.${field.id}`),
    body: str(text.tldr?.[field.id]),
  })).filter((field) => field.body && field.label);

  const tldrNumber = tldr.length ? pad2(1) : '';
  let next = tldr.length ? 2 : 1;
  const anchors = new Set();

  const blocks = (Array.isArray(text.blocks) ? text.blocks : [])
    .map((raw) => normalizeBlock(raw, figure, shown))
    .filter(Boolean)
    .map((block, index) => {
      let anchor = /^[a-z0-9-]+$/i.test(block.id) ? `case-${block.id}` : `case-block-${index + 1}`;
      if (anchors.has(anchor)) anchor = `${anchor}-${index + 1}`;
      anchors.add(anchor);
      if (!TITLED.has(block.type)) return { ...block, anchor, label: '', heading: '', number: '' };

      // Eyebrow = the localized section name for the block id ("02 CONTEXT"); the block title becomes the
      // panel heading. Unknown ids use the title as the eyebrow (then the eyebrow is the heading).
      const section = str(ui.sections?.[block.id]);
      const eyebrow = section || block.title;
      const heading = section && block.title && !same(block.title, section) ? block.title : '';
      if (!eyebrow) return { ...block, anchor, label: '', heading: '', number: '' };
      const number = pad2(next);
      next += 1;
      return { ...block, anchor, label: eyebrow, heading, number };
    });

  return {
    slug,
    project,
    title,
    category: str(text.category),
    headline: str(text.headline),
    summary: str(text.summary),
    liveUrl: typeof project.liveUrl === 'string' && /^https?:\/\//i.test(project.liveUrl) ? project.liveUrl : '',
    stack: strings(project.stack),
    meta,
    tldr,
    tldrNumber,
    heroKey,
    figure,
    blocks,
    closingNumbers: { next: pad2(next), contact: pad2(next + 1) },
  };
});

// ---------------------------------------------------------------------------------------------
// next/image `sizes` for images inside a panel, derived from the layout tokens:
// container min(1280px, 100vw − 2·gutter), gutter clamp(16px, 4vw, 80px), panel inline padding
// 20 / 24 / 40px (< 640 / ≥ 640 / ≥ 1024) and 1px panel borders.
// ---------------------------------------------------------------------------------------------

const SEGMENTS = [
  // [min viewport width, vw factor, px offset]: content width = factor·vw + offset
  [1392, 0, 1198],
  [1024, 0.92, -82],
  [640, 0.92, -50],
  [400, 0.92, -42],
  [0, 1, -74],
];

function panelContentWidth(vw) {
  const gutter = Math.min(80, Math.max(16, 0.04 * vw));
  const pad = vw >= 1024 ? 40 : vw >= 640 ? 24 : 20;
  return Math.min(1280, vw - 2 * gutter) - 2 * pad - 2;
}

/**
 * `sizes` for an image that spans a panel's content box (minus `inset` px of inner padding), never wider
 * than `cap` px (e.g. a 1× capture that should not be upscaled).
 */
export function panelSizes(cap = Infinity, inset = 0) {
  const expr = ([, factor, offset]) => {
    const px = offset - inset;
    return factor === 0 ? `${px}px` : `calc(${Math.round(factor * 100)}vw - ${-px}px)`;
  };
  let breakpoint = Infinity;
  if (Number.isFinite(cap)) {
    for (let vw = 320; vw <= 2400; vw += 1) {
      if (panelContentWidth(vw) - inset >= cap) {
        breakpoint = vw;
        break;
      }
    }
  }
  const parts = [];
  if (Number.isFinite(breakpoint)) parts.push(`(min-width: ${breakpoint}px) ${Math.round(cap)}px`);
  for (const segment of SEGMENTS) {
    if (segment[0] >= breakpoint) continue;
    parts.push(segment[0] > 0 ? `(min-width: ${segment[0]}px) ${expr(segment)}` : expr(segment));
  }
  return parts.join(', ');
}
