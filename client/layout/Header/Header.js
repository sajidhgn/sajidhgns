/**
 * Header — the site header on every page (SPEC §3). Server component: it reads the messages (layout + home)
 * and hands plain data to the client island HeaderClient, which owns the sticky state, the home-page
 * scroll-spy and the mobile menu (it needs the current path, which a layout never re-renders for).
 *
 * export default async function Header({ locale })
 *   locale  "en" | "ar"
 *
 * Nav items exactly like the reference: Home, About, Skills, Services, Projects, Experience,
 * [Testimonials — only while home.testimonials.items has real entries], Contact. Each id is the section id
 * on the home page (the Expertise panel is #services).
 */
import { getMessages, getTranslations } from 'next-intl/server';
import HeaderClient from './HeaderClient';

const SECTIONS = ['home', 'about', 'skills', 'services', 'projects', 'experience', 'testimonials', 'contact'];

export default async function Header({ locale }) {
  const [t, messages] = await Promise.all([
    getTranslations({ locale, namespace: 'layout' }),
    getMessages({ locale }),
  ]);
  const testimonials = messages.home?.testimonials?.items;
  const hasTestimonials = Array.isArray(testimonials) && testimonials.length > 0;

  const items = SECTIONS.filter((id) => id !== 'testimonials' || hasTestimonials).map((id) => ({
    id,
    label: t(`nav.${id}`),
  }));

  return <HeaderClient locale={locale} items={items} navLabel={t('nav.label')} ctaLabel={t('nav.cta')} />;
}
