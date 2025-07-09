// app/[locale]/layout.js or layout.tsx

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server'; // ✅ include setRequestLocale
import { notFound } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/sass/style.scss';
import '../../styles/font-awesome.min.css';
import '../../styles/themify-icons.css';
import '../../styles/flaticon.css';

const locales = ['en', 'ar'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }) {
  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} translate="no">
      <body className={`br-app ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
