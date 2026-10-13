import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { permanentRedirect } from '../../../../i18n/navigation';
import { getProjectByLegacyId } from '../../../../content/projects';

// Legacy URLs (/[locale]/project/<id>) → 308 to /[locale]/work/<slug>. Rendered per request so the
// response is always a real HTTP redirect; unknown ids → the localized 404.
export const dynamic = 'force-dynamic';

export const metadata = {
  robots: { index: false, follow: true },
};

export default function LegacyProjectRedirect({ params: { locale, id } }) {
  setRequestLocale(locale);
  const project = getProjectByLegacyId(id);
  if (!project) notFound();
  permanentRedirect({ href: `/work/${project.slug}`, locale });
}
