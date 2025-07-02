import React from "react";
import Head from "next/head";

const CommonHead = ({ title = "Sajidhgn | Senior Software Engineer", description, keywords }) => {

  return (
    <Head>
      <title>{title}</title>

      {/* Charset and viewport */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Basic SEO */}
      <meta name="description" content={description || "Sajidhgn is a Senior Software Engineer, experienced in creating beautiful and functional websites and web applications."} />
      <meta name="keywords" content={keywords || "portfolio, personal website, web developer, sajidhgn, full stack developer"} />
      <meta name="author" content="Sajidhgn" />

      {/* Open Graph (Facebook/LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || "Portfolio website of Sajidhgn, a Senior Software Engineer."} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.sajidhgn.com" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description || "Portfolio website of Sajidhgn, a Senior Software Engineer."} />
      <meta name="twitter:creator" content="@sajidhgn" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Canonical URL */}
      <link rel="canonical" href="https://www.sajidhgn.com" />
    </Head>
  );
};

export default CommonHead;
