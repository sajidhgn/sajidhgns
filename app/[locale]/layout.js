import { Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server'; // ✅ include setRequestLocale
import { notFound } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import AnimatedCursor from '../../client/components/AnimatedCursor/AnimatedCursor';
import SmoothScroll from '../../client/components/SmoothScroll/SmoothScroll';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import '../../styles/sass/style.scss';
import '../../styles/font-awesome.min.css';
import '../../styles/themify-icons.css';
import '../../styles/flaticon.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
});

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
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} translate="no" className={cairo.variable}>
      <body className={`br-app ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
        <SmoothScroll />
        <AnimatedCursor />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
