'use client';

/**
 * Reveal — fade-up-on-first-view, as PROGRESSIVE ENHANCEMENT only (CONTRACT §0.2, SPEC §6).
 *
 * Props
 *   as         element tag string, default 'div' (strings only — this is a client component)
 *   className  extra class
 *   delay      ms before this element animates (stagger grids: index * 60)
 *   children
 *   …rest      passed through (id, aria-*, data-*, style)
 *
 * Guarantees
 *   - The server HTML is fully visible (no opacity:0 is ever rendered on the server).
 *   - Nothing is hidden when JS is off, when IntersectionObserver is missing, or under
 *     prefers-reduced-motion: reduce.
 *   - Elements already on screen (or above it) when the page hydrates are left alone — no flash.
 *   - Only elements below the fold are hidden, right after hydration, and they animate in once.
 *   - Printing shows everything (see styles/_print.scss).
 *   - Never wrap the hero in Reveal (it holds the LCP).
 */
import { useEffect, useRef } from 'react';
import cx from '../cx';
import styles from './Reveal.module.scss';

let observer = null;
const callbacks = new WeakMap();

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const done = callbacks.get(entry.target);
        observer.unobserve(entry.target);
        callbacks.delete(entry.target);
        if (done) done();
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
  );
  return observer;
}

export default function Reveal({ as: Tag = 'div', className, delay = 0, children, style, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) return undefined;
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return undefined;

    // Already visible (or scrolled past)? Leave it exactly as rendered.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return undefined;

    node.dataset.reveal = 'pending';
    const io = getObserver();
    callbacks.set(node, () => {
      node.dataset.reveal = 'shown';
    });
    io.observe(node);

    return () => {
      io.unobserve(node);
      callbacks.delete(node);
      // Never leave an element stuck hidden (StrictMode double effects, unmount before reveal).
      if (node.dataset.reveal === 'pending') delete node.dataset.reveal;
    };
  }, []);

  const mergedStyle = delay ? { ...style, '--reveal-delay': `${delay}ms` } : style;

  return (
    <Tag ref={ref} className={cx(styles.reveal, className)} style={mergedStyle} {...rest}>
      {children}
    </Tag>
  );
}
