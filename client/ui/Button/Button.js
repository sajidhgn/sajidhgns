/**
 * Button — primary / outline / icon buttons and button-styled links (SPEC §3 Buttons).
 * Server- and client-safe: renders a server tree by default; `onClick` only works when Button is rendered
 * from a client component.
 *
 * Props
 *   href          internal ("/", "/#contact", "/work/healthsia", "/resume") → next-intl <Link> (locale-aware);
 *                 "#id" → same-page <a>; http(s) → external <a target="_blank" rel="noopener noreferrer">;
 *                 mailto: / tel: / download → plain <a>. No href → <button>.
 *   onClick       click handler (client components only)
 *   type          <button> type, default "button"
 *   variant       'primary' | 'outline' | 'icon'   (default 'primary')
 *   size          'md' | 'sm'   (md: 50px tall, 48px < 640px; sm: 40px; icon md 44×44, icon sm 40×40)
 *   icon          IconName from client/ui/Icon (directional icons mirror in RTL automatically)
 *   iconPosition  'start' | 'end'   (default 'end')
 *   external      force (true) / suppress (false) the external-link treatment; default: auto from href
 *   download      true or a file name → <a download>
 *   ariaLabel     accessible name — REQUIRED for variant="icon" (unless children are given; they become
 *                 visually hidden text)
 *   title         tooltip; defaults to ariaLabel, else the label when it is plain text
 *   children      label
 *   className     extra class (module styles override the primitive: it lives in the `ui` cascade layer)
 *   …rest         passed to the element (e.g. disabled, aria-*, data-*, form, prefetch)
 *
 * External links get a visually hidden "(opens in new tab)" from messages layout.a11y.opensInNewTab.
 */
import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/navigation';
import Icon from '../Icon/Icon';
import cx from '../cx';
import styles from './Button.module.scss';

const isHttp = (href) => /^(https?:)?\/\//i.test(href);
// App routes: root-relative paths without a file extension (same rule as middleware.js, which skips
// paths containing a dot) — "/resume", "/#contact". Files such as "/x.pdf" stay plain links.
const isInternal = (href) =>
  href.startsWith('/') && !href.startsWith('//') && !/\.[a-z0-9]+$/i.test(href.split(/[?#]/)[0]);

export default function Button({
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'end',
  external,
  download,
  ariaLabel,
  title,
  children,
  className,
  ...rest
}) {
  const t = useTranslations('layout');
  const iconOnly = variant === 'icon';
  const iconSize = iconOnly ? 18 : size === 'sm' ? 16 : 18;
  const glyph = icon ? <Icon name={icon} size={iconSize} className={styles.icon} /> : null;

  const classes = cx(
    styles.btn,
    iconOnly ? styles.iconOnly : styles[variant],
    styles[size],
    className
  );

  const content = iconOnly ? (
    <>
      {glyph}
      {children ? <span className="visually-hidden">{children}</span> : null}
    </>
  ) : (
    <>
      {iconPosition === 'start' ? glyph : null}
      {children != null ? <span className={styles.label}>{children}</span> : null}
      {iconPosition === 'end' ? glyph : null}
    </>
  );

  const tooltip = title ?? (ariaLabel || (typeof children === 'string' ? children : undefined));
  const a11y = { 'aria-label': ariaLabel || undefined, title: tooltip };

  if (!href) {
    return (
      <button type={type} className={classes} onClick={onClick} {...a11y} {...rest}>
        {content}
      </button>
    );
  }

  const isExternal = external ?? isHttp(href);

  if (isExternal) {
    const newTab = t.has('a11y.opensInNewTab') ? t('a11y.opensInNewTab') : '(opens in a new tab)';
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onClick}
        // An aria-label replaces the content, so the new-tab hint has to be part of it.
        aria-label={ariaLabel ? `${ariaLabel} ${newTab}` : undefined}
        title={tooltip}
        {...rest}
      >
        {content}
        {ariaLabel ? null : <span className="visually-hidden"> {newTab}</span>}
      </a>
    );
  }

  if (download || !isInternal(href)) {
    // mailto:, tel:, same-page "#id", files
    return (
      <a
        href={href}
        download={download === true ? '' : download || undefined}
        className={classes}
        onClick={onClick}
        {...a11y}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick} {...a11y} {...rest}>
      {content}
    </Link>
  );
}
