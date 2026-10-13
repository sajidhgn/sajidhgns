const createNextIntlPlugin = require("next-intl/plugin");

// Reads the request config from ./i18n/request.js (the plugin's default location).
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Parallel builds use isolated output dirs: NEXT_DIST_DIR=.next-<label> npx next build
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  eslint: {
    // `next lint` / `next build` lint these paths (missing ones are skipped). The old template in
    // client/components is deliberately excluded — it is being deleted.
    dirs: [
      "app",
      "client/ui",
      "client/layout",
      "client/sections",
      "client/case-study",
      "client/resume",
      "client/seo",
      "content",
      "i18n",
      "lib",
      "middleware.js",
    ],
  },
  experimental: {
    // Keep SWC (needed by next/font) even though a .babelrc exists for Jest.
    forceSwcTransforms: true,
  },
};

module.exports = withNextIntl(nextConfig);
