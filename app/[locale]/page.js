import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '../../lib/seo';
import Hero from '../../client/sections/Hero/Hero';
import About from '../../client/sections/About/About';
import Skills from '../../client/sections/Skills/Skills';
import Expertise from '../../client/sections/Expertise/Expertise';
import Projects from '../../client/sections/Projects/Projects';
import Experience from '../../client/sections/Experience/Experience';
import Testimonials from '../../client/sections/Testimonials/Testimonials';
import Contact from '../../client/sections/Contact/Contact';
import JsonLd from '../../client/seo/JsonLd/JsonLd';
import styles from './home.module.scss';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return buildMetadata({ locale, path: '', title: t('home.title'), description: t('home.description') });
}

export default async function HomePage({ params: { locale } }) {
  setRequestLocale(locale);

  // Testimonials render only with REAL entries (SPEC allowed deviation 3); section numbers follow the
  // rendered order, so they re-flow when it is hidden.
  const messages = await getMessages({ locale });
  const testimonials = messages.home?.testimonials?.items;
  const showTestimonials = Array.isArray(testimonials) && testimonials.length > 0;

  const order = ['about', 'skills', 'expertise', 'projects', 'experience', showTestimonials && 'testimonials', 'contact'].filter(Boolean);
  const number = (id) => String(order.indexOf(id) + 1).padStart(2, '0');

  return (
    <>
      <JsonLd kind="person" locale={locale} />
      <div className="container bento">
        <Hero locale={locale} />
        <div className={styles.split}>
          <About locale={locale} number={number('about')} />
          <Skills locale={locale} number={number('skills')} />
        </div>
        <Expertise locale={locale} number={number('expertise')} />
        <Projects locale={locale} number={number('projects')} />
        <Experience locale={locale} number={number('experience')} />
        {showTestimonials ? <Testimonials locale={locale} number={number('testimonials')} /> : null}
        <Contact locale={locale} number={number('contact')} />
      </div>
    </>
  );
}
