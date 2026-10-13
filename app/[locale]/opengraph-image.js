/**
 * Open Graph / social card for every page of a locale: /en/opengraph-image, /ar/opengraph-image.
 * 1200×630 PNG, statically generated per locale at build time (generateStaticParams, Node.js runtime).
 *
 * Echoes the home hero: dark #060608 page, a rounded panel, the availability badge, the name with the role
 * in gold, and the portrait cut-out rising out of a glowing gold ring with tilted orbits.
 * The copy is English in both locales on purpose: the card font (DM Sans, OFL — client/seo/fonts) has no
 * Arabic glyphs, so Arabic text would render as boxes.
 * Colours are the SPEC §1 / §4.1 tokens written out (an image renderer cannot read CSS custom properties).
 *
 * Delivered as a JPEG (≈ 75 KB instead of a ≈ 430 KB PNG): link previews in WhatsApp and some other apps
 * skip large preview images. The URL has no content hash when pages reference it explicitly (see
 * client/seo/ogImage.js), so it is cached for a day rather than "immutable".
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import sharp from 'sharp';
import { routing } from '../../i18n/routing';
import { site } from '../../content/site';
import { OG_ALT, OG_SIZE, OG_TYPE } from '../../client/seo/ogImage';

export const runtime = 'nodejs';
export const dynamicParams = false;
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const C = {
  bg: '#060608',
  panelTop: '#14130E',
  panelBottom: '#100F0B',
  line: 'rgba(255, 236, 200, 0.08)',
  pill: '#181712',
  text: '#F8F7F5',
  text2: '#E6E4DE',
  subtle: '#8C8B85',
  gold: '#F9BE4E',
  goldText: '#EDBA58',
  ring: '#E9C77B',
  mint: '#4FD1A1',
};

const read = (file) => readFile(path.join(process.cwd(), file));

// Panel geometry (inside the 1200×630 canvas) and the portrait's ring, in panel coordinates.
const PANEL = { x: 28, y: 28, w: 1144, h: 574 };
const RING = { cx: 840, cy: 312, d: 384 };
const PORTRAIT = 568; // rendered size of the 800×800 cut-out; the face centre sits at ≈ 48.75% of its width

// Orbits around the ring centre: semi-axes a × b, vertical offset dy, CSS rotation (negative = rising to the right).
const ORBITS = [
  { a: 336, b: 60, dy: 22, angle: -17, color: 'rgba(249, 190, 78, 0.3)' },
  { a: 306, b: 48, dy: -64, angle: -11, color: 'rgba(249, 190, 78, 0.18)' },
];
// [orbit index, parametric angle in degrees, dot size]
const ORBIT_DOTS = [
  [0, 196, 7],
  [0, 344, 6],
  [1, 300, 5],
];

/** Point on a rotated ellipse (CSS rotation: positive angles turn clockwise because y points down). */
function orbitPoint({ a, b, dy, angle }, tDeg) {
  const t = (tDeg * Math.PI) / 180;
  const phi = (angle * Math.PI) / 180;
  const ex = a * Math.cos(t);
  const ey = b * Math.sin(t);
  return [RING.cx + ex * Math.cos(phi) - ey * Math.sin(phi), RING.cy + dy + ex * Math.sin(phi) + ey * Math.cos(phi)];
}

const circle = (d, cx, cy) => ({ position: 'absolute', left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: 9999 });

function Dot({ x, y, size: d = 6, opacity = 1 }) {
  return (
    <div
      style={{
        ...circle(d, x, y),
        background: C.gold,
        opacity,
        boxShadow: `0 0 ${d * 2}px ${d / 2}px rgba(249, 190, 78, 0.55)`,
      }}
    />
  );
}

export default async function OpengraphImage() {
  const [cutout, regular, medium, semibold, bold] = await Promise.all([
    read(`public${site.cutout.src}`),
    read('client/seo/fonts/DMSans-Regular.ttf'),
    read('client/seo/fonts/DMSans-Medium.ttf'),
    read('client/seo/fonts/DMSans-SemiBold.ttf'),
    read('client/seo/fonts/DMSans-Bold.ttf'),
  ]);
  const portrait = `data:image/png;base64,${cutout.toString('base64')}`;
  const host = new URL(site.url).host;

  const card = new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          background: C.bg,
          backgroundImage:
            'radial-gradient(circle at 100% 0%, rgba(255, 250, 185, 0.085) 0%, rgba(255, 250, 185, 0.03) 30%, rgba(255, 250, 185, 0) 55%)',
          fontFamily: 'DM Sans',
          color: C.text,
        }}
      >
        {/* The hero panel */}
        <div
          style={{
            position: 'absolute',
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            display: 'flex',
            overflow: 'hidden',
            borderRadius: 26,
            border: `1px solid ${C.line}`,
            backgroundImage: `linear-gradient(180deg, ${C.panelTop} 0%, ${C.panelBottom} 100%)`,
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
          }}
        >
          {/* Warm glow behind the portrait */}
          <div
            style={{
              ...circle(760, RING.cx, RING.cy),
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(249, 190, 78, 0.2) 0%, rgba(249, 190, 78, 0.06) 38%, rgba(249, 190, 78, 0) 70%)',
            }}
          />
          {/* Diagonal light streak across the visual side (lower-left → upper-right), a soft elongated glow */}
          <div
            style={{
              position: 'absolute',
              left: RING.cx - 520,
              top: RING.cy - 110,
              width: 1100,
              height: 220,
              transform: 'rotate(-24deg)',
              backgroundImage:
                'radial-gradient(ellipse at 50% 50%, rgba(255, 214, 150, 0.13) 0%, rgba(249, 190, 78, 0.05) 32%, rgba(249, 190, 78, 0) 68%)',
            }}
          />
          {/* Large faint circle */}
          <div style={{ ...circle(580, RING.cx, RING.cy), border: '1px solid rgba(255, 255, 255, 0.06)' }} />
          {/* Gold ring */}
          <div
            style={{
              ...circle(RING.d, RING.cx, RING.cy),
              border: `2px solid ${C.ring}`,
              boxShadow: '0 0 26px 2px rgba(249, 190, 78, 0.45), inset 0 0 22px rgba(249, 190, 78, 0.22)',
            }}
          />
          {/* Tilted orbits (true ellipses) with small glowing dots on them */}
          {ORBITS.map((orbit) => (
            <div
              key={orbit.a}
              style={{
                position: 'absolute',
                left: RING.cx - orbit.a,
                top: RING.cy + orbit.dy - orbit.b,
                width: orbit.a * 2,
                height: orbit.b * 2,
                borderRadius: '50%',
                border: `1px solid ${orbit.color}`,
                transform: `rotate(${orbit.angle}deg)`,
              }}
            />
          ))}
          {ORBIT_DOTS.map(([index, t, d]) => {
            const [x, y] = orbitPoint(ORBITS[index], t);
            return <Dot key={`${index}-${t}`} x={x} y={y} size={d} />;
          })}
          {/* Sparkles */}
          <Dot x={RING.cx - 262} y={RING.cy - 190} size={3} opacity={0.8} />
          <Dot x={RING.cx + 272} y={RING.cy + 120} size={3} opacity={0.7} />
          <Dot x={RING.cx - 218} y={RING.cy + 196} size={2} opacity={0.7} />
          <Dot x={RING.cx + 168} y={RING.cy - 238} size={2} opacity={0.6} />
          <Dot x={RING.cx - 120} y={RING.cy - 250} size={2} opacity={0.5} />

          {/* Portrait: the head rises above the ring, the shoulders run off the panel's bottom edge */}
          {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element -- rendered to a PNG by next/og */}
          <img
            src={portrait}
            width={PORTRAIT}
            height={PORTRAIT}
            style={{ position: 'absolute', left: RING.cx - PORTRAIT * 0.4875, top: 20 }}
          />

          {/* Copy */}
          <div
            style={{
              position: 'absolute',
              left: 64,
              top: 54,
              bottom: 54,
              width: 560,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo: hexagon mark + SAJID.ALI */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="34" height="39" viewBox="0 0 34 39" fill="none">
                <path
                  d="M15.4 1.72A3.2 3.2 0 0 1 18.6 1.72L31.59 9.23A3.2 3.2 0 0 1 33.19 12L33.19 27A3.2 3.2 0 0 1 31.59 29.77L18.6 37.28A3.2 3.2 0 0 1 15.4 37.28L2.41 29.77A3.2 3.2 0 0 1 0.81 27L0.81 12A3.2 3.2 0 0 1 2.41 9.23Z"
                  stroke={C.gold}
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.4 14.1C21.6 12.2 19.6 11.1 17.1 11.1 14 11.1 11.9 12.8 11.9 15.2 11.9 17.7 14 18.6 17 19.3 20.3 20 22.4 21.1 22.4 23.7 22.4 26.3 20.1 27.9 16.9 27.9 14.4 27.9 12.4 26.8 11.5 24.9"
                  stroke={C.gold}
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ display: 'flex', marginLeft: 12, fontSize: 22, letterSpacing: 0.2 }}>
                <span style={{ fontWeight: 700 }}>SAJID</span>
                <span style={{ fontWeight: 400 }}>.ALI</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Availability badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  height: 46,
                  padding: '0 20px',
                  borderRadius: 12,
                  border: `1px solid ${C.line}`,
                  background: C.pill,
                  fontSize: 20,
                  fontWeight: 500,
                  color: C.text2,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    marginRight: 14,
                    borderRadius: 9999,
                    background: C.mint,
                    boxShadow: '0 0 0 4px rgba(79, 209, 161, 0.16)',
                  }}
                />
                Riyadh · Available for new opportunities
              </div>
              <div style={{ marginTop: 30, fontSize: 88, fontWeight: 600, lineHeight: 1, letterSpacing: -1.8 }}>
                Sajid Ali
              </div>
              <div style={{ marginTop: 18, fontSize: 42, fontWeight: 600, lineHeight: 1.1, letterSpacing: -0.6, color: C.goldText }}>
                Senior UI/UX Designer
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', fontSize: 20, fontWeight: 500, color: C.subtle }}>
              {host}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 10 }}>
                <path d="M5.5 18.5 18.5 5.5" stroke={C.gold} strokeWidth="2" strokeLinecap="round" />
                <path d="M8 5.5h10.5V16" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'DM Sans', data: regular, weight: 400, style: 'normal' },
        { name: 'DM Sans', data: medium, weight: 500, style: 'normal' },
        { name: 'DM Sans', data: semibold, weight: 600, style: 'normal' },
        { name: 'DM Sans', data: bold, weight: 700, style: 'normal' },
      ],
    }
  );

  const png = Buffer.from(await card.arrayBuffer());
  const jpeg = await sharp(png)
    .flatten({ background: C.bg })
    .jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toBuffer();

  return new Response(jpeg, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control':
        process.env.NODE_ENV === 'development' ? 'no-cache, no-store' : 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
