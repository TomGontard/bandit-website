// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // active le transformateur styled-components pour Next.js ≥12
    styledComponents: true,
  },
};

module.exports = nextConfig;
