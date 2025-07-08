'use client';
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

      {/* Canonical URL */}
      <link rel="canonical" href="https://www.sajidhgn.com" />
    </Head>
  );
};

export default CommonHead;
