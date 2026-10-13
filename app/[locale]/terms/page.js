/**
 * /[locale]/terms — Terms of Service (SPEC §5; the reference footer's "Terms of Service" link).
 * Text: the server-only `legal` namespace (messages/<locale>/legal.json); layout: client/legal/LegalPage.
 */
import { setRequestLocale } from 'next-intl/server';
import { routing } from '../../../i18n/routing';
import LegalPage, { legalMetadata } from '../../../client/legal/LegalPage/LegalPage';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }) {
  return legalMetadata({ locale, doc: 'terms' });
}

export default function TermsPage({ params: { locale } }) {
  setRequestLocale(locale);
  return <LegalPage locale={locale} doc="terms" />;
}
