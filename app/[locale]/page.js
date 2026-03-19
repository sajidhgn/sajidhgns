import React, { Fragment } from "react";
import ContactArea from "../../client/components/ContactArea";
import ExprienceSec from "../../client/components/Exprience/Exprience";
import Footer from "../../client/components/footer/Footer";
import Hero from "../../client/components/hero/hero";
import Navbar from "../../client/components/Navbar/Navbar";
import About from "../../client/components/about/about";
import ProjectSection from "../../client/components/ProjectSection/ProjectSection";
import Scrollbar from "../../client/components/scrollbar/scrollbar";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'SEO' });

  return {
    metadataBase: new URL('https://sajidhgn.vercel.app'),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: 'Sajidhgn', url: 'https://sajidhgn.vercel.app' }],
    publisher: 'Sajidhgn',
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'ar': '/ar',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://sajidhgn.vercel.app/${locale}`,
      images: [
        {
          url: "/images/sajidhgn.png",
          width: 1200,
          height: 630,
          alt: "Sajidhgn Portfolio Screenshot",
        },
      ],
      siteName: 'Sajidhgn',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/sajidhgn.png'],
    },
  };
}

const Home = () => {

  return (
    <div id="scrool">
      <Fragment>
        <div className="br-app">
          <Navbar />
          <Hero />
          <About />
          <ExprienceSec />
          <ProjectSection />
          <ContactArea />
          <Footer />
          <Scrollbar />
        </div>
      </Fragment>
    </div>
  );
}

export default Home;