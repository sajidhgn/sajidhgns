'use client';

/**
 * TestimonialsNav — prev / next buttons for the testimonials track (client island, rendered by Testimonials
 * only when there are more than 3 entries).
 *
 * export default function TestimonialsNav({ trackId, prevLabel, nextLabel })
 *   trackId    id of the scrollable <ul> (aria-controls)
 *   prevLabel  accessible name, e.g. "Previous testimonials"
 *   nextLabel  accessible name, e.g. "Next testimonials"
 *
 * Each click scrolls by one card (+ gap) along the reading direction (RTL-aware), smoothly unless the visitor
 * prefers reduced motion. At either end the button is aria-disabled (it stays focusable, so focus is never
 * lost). Chevrons mirror in RTL (Icon's directional default). 32px visual box, 44px hit area.
 */
import { useEffect, useState } from 'react';
import Icon from '../../ui/Icon/Icon';
import styles from './Testimonials.module.scss';

export default function TestimonialsNav({ trackId, prevLabel, nextLabel }) {
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = document.getElementById(trackId);
    if (!track) return undefined;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const position = Math.abs(track.scrollLeft); // RTL scrollLeft runs 0 → negative
      setEdges({ start: position <= 1, end: position >= max - 1 });
    };
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [trackId]);

  const go = (direction) => {
    const track = document.getElementById(trackId);
    if (!track) return;
    const style = window.getComputedStyle(track);
    const slide = track.firstElementChild;
    const step = (slide ? slide.getBoundingClientRect().width : track.clientWidth) + (parseFloat(style.columnGap) || 0);
    const sign = style.direction === 'rtl' ? -1 : 1;
    const smooth = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    track.scrollBy({ left: direction * sign * step, behavior: smooth ? 'smooth' : 'auto' });
  };

  return (
    <div className={styles.nav}>
      <button
        type="button"
        className={styles.navButton}
        aria-label={prevLabel}
        aria-controls={trackId}
        aria-disabled={edges.start ? 'true' : undefined}
        onClick={() => !edges.start && go(-1)}
      >
        <Icon name="chevron-left" size={16} />
      </button>
      <button
        type="button"
        className={styles.navButton}
        aria-label={nextLabel}
        aria-controls={trackId}
        aria-disabled={edges.end ? 'true' : undefined}
        onClick={() => !edges.end && go(1)}
      >
        <Icon name="chevron-right" size={16} />
      </button>
    </div>
  );
}
