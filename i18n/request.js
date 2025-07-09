import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server'; // fixed import

const locales = ['en', 'ar'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`../public//locales/${locale}.json`)).default
  };
});