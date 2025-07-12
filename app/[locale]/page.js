import React, { Fragment } from "react";
import CommonHead from "../../components/commonHead";
import ContactArea from "../../components/ContactArea";
import ExprienceSec from "../../components/Exprience/Exprience";
import Footer from "../../components/footer/Footer";
import Hero from "../../components/hero/hero";
import Navbar from "../../components/Navbar/Navbar";
import About from "../../components/about/about";
import ProjectSection from "../../components/ProjectSection/ProjectSection";
import Scrollbar from "../../components/scrollbar/scrollbar";

export const metadata = {
   metadataBase: new URL('https://www.sajidhgn.versal.app'),
    title: `Sajidhgn | Senior Software Engineer`,
    description: 'Sajidhgn is a Senior Software Engineer, experienced in creating beautiful and functional websites and web applications.',
    keywords: "portfolio, personal website, web developer",
    authors: [{ name: 'Sajidhgn', url: 'https://sajidhgn.versal.app' }],
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
      canonical: '/',
      languages: {
        'en-US': '/en-US',
        'ar-AR': '/ar-AR',
      },
    },
    openGraph: {
      title: `Sajidhgn | Senior Software Engineer`,
      description: 'Sajidhgn is a Senior Software Engineer, experienced in creating beautiful and functional websites and web applications.',
      url: `https://www.sajidhgn.versal.app`,
      images: [{ url: "/images/sajidhgn.png" }],
      siteName: 'Sajidhgn',
      locale: ['en-US', 'ar-AR'],
      type: 'website'},
  };

const Home=()=>{
  
  return (
    <div id="scrool">
      <CommonHead />
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