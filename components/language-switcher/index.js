'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = params.locale;

  const switchLanguage = (locale) => {
    if (locale !== currentLocale) {
      const newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`);
      router.push(newPathname);
    }
  };

  return (
    <>
      <select
        id="languageSwitcher"
        className="form-select"
        value={currentLocale}
        onChange={(e) => switchLanguage(e.target.value)}
      >
        <option value="en"> English </option>
        <option value="ar">Arabic</option>
      </select>
    </>
  );
}
