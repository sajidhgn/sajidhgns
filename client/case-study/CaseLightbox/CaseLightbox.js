'use client';

/**
 * CaseLightbox — the gallery's thumbnail grid and its <dialog> image viewer (SPEC §5). Client island.
 * Rendered by CaseGallery (server), which resolves the figures.
 *
 * Props
 *   items  [{ key, src, width, height, alt, caption, testData, kind, lowRes }]  (plain, serialisable)
 *   title  gallery name, used in the dialog's accessible name ("HealthSIA screens — image viewer")
 *   sizes  next/image `sizes` for the thumbnails
 *
 * Progressive enhancement: every thumbnail is a real link to the full-size image, so without JS it still
 * opens the image. With JS the click opens a modal <dialog> (showModal: focus is trapped, the page is
 * inert), with:
 *   - previous / next buttons, ← / → keys (mirrored in RTL), Home / End, horizontal swipe;
 *   - Esc, the close button or a click on the empty backdrop closes it;
 *   - a polite live counter ("Image 2 of 5"), the caption and the "Shown with test data" note;
 *   - focus returns to the thumbnail of the image that was on screen;
 *   - page scrolling is locked with the `scroll-lock` class on <html> (never on <body>).
 * Images are never upscaled past their natural width (low-resolution phone screens stay small).
 * Labels: case.gallery.* and case.figure.testData.
 */
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import cx from '../../ui/cx';
import styles from './CaseLightbox.module.scss';

/** Very tall captures scroll inside the viewer instead of shrinking to an unreadable strip. */
const SCROLL_RATIO = 2.4;
const SWIPE_MIN = 48;

const isRtl = () => typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

/** `sizes` for the viewer image: it fills the stage but never exceeds its natural width. */
function viewerSizes(item, scroll) {
  if (item.lowRes) return `${item.width}px`;
  if (scroll) {
    const cap = Math.min(item.width, 1100);
    return `(min-width: ${Math.ceil(cap / 0.9)}px) ${cap}px, 90vw`;
  }
  if (item.kind === 'mobile' || item.height > item.width) return '(min-width: 768px) 42vh, 78vw';
  const cap = Math.min(item.width, 1320);
  return `(min-width: ${Math.ceil(cap / 0.92)}px) ${cap}px, 92vw`;
}

function Note({ children }) {
  return (
    <span className={styles.note}>
      <Icon name="database" size={12} className={styles.noteIcon} />
      {children}
    </span>
  );
}

export default function CaseLightbox({ items = [], title = '', sizes }) {
  const t = useTranslations('case');
  const label = (key, values) => (t.has(key) ? t(key, values) : '');
  const captionId = useId();
  const dialogRef = useRef(null);
  const thumbs = useRef([]);
  const touch = useRef(null);
  const [index, setIndex] = useState(-1);
  const indexRef = useRef(-1);
  indexRef.current = index;

  const total = items.length;
  const isOpen = index >= 0 && index < total;
  const item = isOpen ? items[index] : null;
  const scroll = Boolean(item && item.kind !== 'mobile' && item.height / item.width > SCROLL_RATIO);
  const testNote = label('figure.testData');

  // Open the modal once the slide is in the DOM.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog || dialog.open) return;
    document.documentElement.classList.add('scroll-lock');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }, [isOpen]);

  // Every way of closing (Esc, button, backdrop) ends here: unlock and return focus.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const onClose = () => {
      document.documentElement.classList.remove('scroll-lock');
      const last = indexRef.current;
      setIndex(-1);
      thumbs.current[last]?.focus();
    };
    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('close', onClose);
      document.documentElement.classList.remove('scroll-lock');
    };
  }, []);

  const go = useCallback(
    (delta) => setIndex((current) => (current < 0 ? current : (current + delta + total) % total)),
    [total]
  );
  const close = useCallback(() => dialogRef.current?.close(), []);

  const onThumbClick = (event, nextIndex) => {
    // Let modified clicks (new tab / window / download) do what the visitor asked for.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setIndex(nextIndex);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      if (total < 2) return;
      event.preventDefault();
      go((event.key === 'ArrowRight') !== isRtl() ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setIndex(event.key === 'Home' ? 0 : total - 1);
    }
  };

  // A click on the empty stage (not the image, caption or buttons) closes the viewer.
  const onDialogClick = (event) => {
    if (event.target === event.currentTarget || event.target?.dataset?.dismiss === 'true') close();
  };

  const onTouchStart = (event) => {
    const point = event.changedTouches?.[0];
    touch.current = point ? { x: point.clientX, y: point.clientY } : null;
  };
  const onTouchEnd = (event) => {
    const start = touch.current;
    touch.current = null;
    const point = event.changedTouches?.[0];
    if (!start || !point || total < 2) return;
    const dx = point.clientX - start.x;
    const dy = point.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    go((dx < 0) !== isRtl() ? 1 : -1);
  };

  if (!total) return null;

  return (
    <>
      <ul role="list" className={styles.grid}>
        {items.map((entry, entryIndex) => (
          <li key={entry.key} className={styles.item}>
            <a
              href={entry.src}
              ref={(node) => {
                thumbs.current[entryIndex] = node;
              }}
              className={styles.thumb}
              aria-haspopup="dialog"
              onClick={(event) => onThumbClick(event, entryIndex)}
            >
              <span className={cx(styles.thumbMedia, entry.kind === 'mobile' && styles.thumbMobile)}>
                <Image src={entry.src} alt={entry.alt} title={entry.alt} fill sizes={sizes} quality={70} className={styles.thumbImage} />
              </span>
              <span className={styles.zoom} aria-hidden="true">
                <Icon name="maximize" size={15} />
              </span>
              <span className="visually-hidden">{label('gallery.open')}</span>
            </a>
            {entry.caption || (entry.testData && testNote) ? (
              <p className={styles.thumbCaption}>
                {entry.testData && testNote ? <Note>{testNote}</Note> : null}
                {entry.caption ? <span className={styles.thumbCaptionText}>{entry.caption}</span> : null}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={label('gallery.dialog', { title }) || title}
        aria-describedby={item?.caption ? captionId : undefined}
        onKeyDown={onKeyDown}
        onClick={onDialogClick}
      >
        {item ? (
          <div className={styles.layout} data-dismiss="true">
            <p className={styles.counter} aria-live="polite" aria-atomic="true">
              {label('gallery.counter', { current: String(index + 1), total: String(total) })}
            </p>
            <Button variant="icon" icon="x" ariaLabel={label('gallery.close')} onClick={close} className={styles.close} />
            {total > 1 ? (
              <Button
                variant="icon"
                icon="chevron-left"
                ariaLabel={label('gallery.previous')}
                onClick={() => go(-1)}
                className={styles.prev}
              />
            ) : null}
            <figure className={styles.slide} data-dismiss="true" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div
                className={cx(styles.media, scroll && styles.scroll)}
                // A scrollable stage must not close on clicks (its scrollbar would dismiss the viewer).
                {...(scroll ? { role: 'region', tabIndex: 0, 'aria-label': item.alt } : { 'data-dismiss': 'true' })}
              >
                <Image
                  key={item.src}
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  alt={item.alt}
                  title={item.alt}
                  sizes={viewerSizes(item, scroll)}
                  quality={85}
                  className={styles.image}
                  style={scroll ? { width: `min(100%, ${item.width}px)` } : undefined}
                />
              </div>
              {item.caption || (item.testData && testNote) ? (
                <figcaption className={styles.caption}>
                  {item.testData && testNote ? <Note>{testNote}</Note> : null}
                  {item.caption ? <span id={captionId}>{item.caption}</span> : null}
                </figcaption>
              ) : null}
            </figure>
            {total > 1 ? (
              <Button
                variant="icon"
                icon="chevron-right"
                ariaLabel={label('gallery.next')}
                onClick={() => go(1)}
                className={styles.next}
              />
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
