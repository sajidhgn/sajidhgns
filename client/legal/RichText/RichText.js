/**
 * RichText — renders a plain message string and turns the email addresses and http(s) URLs in it into
 * links, so the legal copy stays plain text in messages (no markup in JSON). Server- and client-safe.
 *
 * export default function RichText({ text, newTabLabel })
 *   text         the string
 *   newTabLabel  visually hidden suffix for external links, e.g. layout.a11y.opensInNewTab
 *
 * Emails → mailto: links; URLs → external links (new tab, rel="noopener noreferrer", shown without the
 * protocol). Both are wrapped in <bdi dir="ltr"> so they read correctly inside Arabic text (CONTRACT §0.4).
 * Trailing punctuation stays outside the link. The links have no class, so the base styles make them gold
 * and underlined like every link in running text.
 */
import { Fragment } from 'react';

const TOKEN = /([A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})|(https?:\/\/[^\s<>«»"“”]+)/g;
const TRAILING = /[.,;:!?)\]}'’”»،؛]+$/;

export default function RichText({ text, newTabLabel = '(opens in new tab)' }) {
  if (typeof text !== 'string' || !text) return null;

  const parts = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(TOKEN)) {
    let token = match[0];
    const trailing = match[2] ? (token.match(TRAILING)?.[0] ?? '') : '';
    if (trailing) token = token.slice(0, -trailing.length);
    if (match.index > last) parts.push(<Fragment key={key++}>{text.slice(last, match.index)}</Fragment>);

    if (match[1]) {
      parts.push(
        <a key={key++} href={`mailto:${token}`}>
          <bdi dir="ltr">{token}</bdi>
        </a>
      );
    } else {
      parts.push(
        <a key={key++} href={token} target="_blank" rel="noopener noreferrer">
          <bdi dir="ltr">{token.replace(/^https?:\/\//, '')}</bdi>
          <span className="visually-hidden"> {newTabLabel}</span>
        </a>
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);

  return <>{parts}</>;
}
