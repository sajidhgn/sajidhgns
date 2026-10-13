/**
 * ServiceIcon — the four gold line marks of the Services cards (reference c_services.jpg), drawn here because
 * client/ui/Icon has no cube or bezier-nodes glyph and its code/gauge marks have different proportions.
 * Server- and client-safe (no hooks). Internal to the Expertise section.
 *
 * Props
 *   name       'webdev' | 'uiux' | 'api' | 'performance' — unknown names render nothing
 *   size       px, default 28 (the reference glyphs measure ≈ 23–25px inside a 48px tile)
 *   className  extra class on the <svg>
 *
 * 24px viewBox, round caps/joins, currentColor, decorative (aria-hidden, focusable=false). The `icon` class
 * opts into the non-scaling stroke rule of styles/_base.scss, so the 2px stroke stays 2 CSS px: the reference
 * strokes measure ≈ 2px at this size (SPEC's 1.6px at 22px, scaled to the measured glyph size).
 * None of these marks is directional, so nothing mirrors in RTL ("</>" is code, not a reading direction).
 */
import cx from '../../ui/cx';

const GLYPHS = {
  // Browser/code window with "</>".
  webdev: (
    <>
      <rect x="2" y="4.25" width="20" height="15.5" rx="3.4" />
      <path d="m8 9-3 3 3 3" />
      <path d="m16 9 3 3-3 3" />
      <path d="m13.4 7.6-2.8 8.8" />
    </>
  ),
  // Bezier / pen-tool nodes: anchor (top-left) → handle to the bottom-right node, control lines to the
  // bottom-left node — the reference's three-node mark.
  uiux: (
    <>
      <rect x="2.75" y="2.25" width="6" height="6" rx="1.75" />
      <path d="M8.75 5.25H13a4.75 4.75 0 0 1 4.75 4.75v3.25" />
      <rect x="14.5" y="13.25" width="6.5" height="6.5" rx="1.9" />
      <path d="M7.4 8.25 12.25 12l-4.63 4.13" />
      <circle cx="5.5" cy="18.25" r="3" />
      <path d="M8.2 16.9h6.3" />
    </>
  ),
  // Isometric 3-D cube with face details.
  api: (
    <>
      <path d="M12 2.5 20.5 7.25v9.5L12 21.5l-8.5-4.75v-9.5Z" />
      <path d="M3.5 7.25 12 12l8.5-4.75" />
      <path d="M12 12v9.5" />
      <path d="m7.75 4.88 4.25 2.37 4.25-2.37" />
      <path d="m3.5 12 4.25 2.38v4.74" />
      <path d="m20.5 12-4.25 2.38v4.74" />
    </>
  ),
  // Gauge / speedometer: closed dome, ticks on the upper-left arc, needle to the upper right.
  performance: (
    <>
      <path d="M2.5 17V13a9.5 9.5 0 0 1 19 0v4a1.75 1.75 0 0 1-1.75 1.75H4.25A1.75 1.75 0 0 1 2.5 17Z" />
      <path d="m11.25 16 6.25-6.25" />
      <path d="M5.25 13H7" />
      <path d="m7.25 8.25 1.25 1.25" />
      <path d="M12 5.75v1.75" />
    </>
  ),
};

/** The glyph names this component can draw. */
export const SERVICE_ICON_NAMES = Object.keys(GLYPHS);

export default function ServiceIcon({ name, size = 28, className }) {
  const shape = Object.prototype.hasOwnProperty.call(GLYPHS, name) ? GLYPHS[name] : null;
  if (!shape) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cx('icon', className)}
    >
      {shape}
    </svg>
  );
}
