import { notFound } from 'next/navigation';

// Unknown paths under a locale (/en/anything) render the localized app/[locale]/not-found.js inside the
// site layout, instead of Next's unstyled root 404 (next-intl's recommended catch-all).
export default function CatchAllNotFound() {
  notFound();
}
