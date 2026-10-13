import { Cairo, DM_Sans, Mrs_Saint_Delafield } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../i18n/routing';
import { pickMessages } from '../../i18n/messages';
import { dir } from '../../lib/i18n';
import { buildMetadata } from '../../lib/seo';
import { site } from '../../content/site';
import SkipLink from '../../client/layout/SkipLink/SkipLink';
import Header from '../../client/layout/Header/Header';
import Footer from '../../client/layout/Footer/Footer';
import '../../styles/globals.scss';

// SPEC §2 — fonts via next/font only.
const sans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sans',
});

// Cairo's next/font CSS also carries Latin @font-face rules (`subsets` only controls preloading), so it must
// come AFTER DM Sans in every stack. No metric-adjusted fallback face (local Arial without unicode-range).
const arabic = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic',
  adjustFontFallback: false,
});

// Decorative signature on the About photo only.
const script = Mrs_Saint_Delafield({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-script',
});

// DM Sans's primary family alone — without next/font's metric-adjusted fallback face (local Arial, no
// unicode-range), which would render Arabic glyphs in Arial before Cairo is reached. Used by the Arabic
// font stack (--font-stack-ar); same @font-face rules and files as --font-sans, so nothing extra loads.
const sansPrimaryFamily = sans.style.fontFamily.split(',')[0].trim();

export const viewport = {
  themeColor: '#060608',
  colorScheme: 'dark',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }) {
  if (!routing.locales.includes(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  const siteName = t('siteName');
  const name = site.name[locale] ?? site.name.en;

  // Site-wide defaults. Every page sets its own canonical/alternates/OpenGraph URL with buildMetadata(),
  // so they are deliberately not inherited from here (a wrong inherited canonical is worse than none).
  const base = buildMetadata({ locale, title: t('home.title'), description: t('home.description') });
  delete base.alternates;
  const openGraph = { ...base.openGraph };
  delete openGraph.url;

  return {
    ...base,
    title: { default: t('home.title'), template: `%s · ${siteName}` },
    applicationName: siteName,
    authors: [{ name, url: site.url }],
    creator: name,
    publisher: name,
    keywords: t('keywords'),
    icons: { icon: '/favicon.ico' },
    formatDetection: { telephone: false, email: false, address: false },
    openGraph,
  };
}

export default async function LocaleLayout({ children, params: { locale } }) {
  if (!routing.locales.includes(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${sans.variable} ${arabic.variable} ${script.variable}`}
      style={{ '--font-sans-ar': sansPrimaryFamily }}
    >
      <body>
        <div className="page-decor" aria-hidden="true" />
        <NextIntlClientProvider locale={locale} messages={pickMessages(messages)}>
          <SkipLink />
          <Header locale={locale} />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
