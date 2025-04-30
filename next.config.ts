// next.config.ts
const nextConfig = {
  reactStrictMode: true,
  compiler: { styledComponents: true },
  experimental: {
    appDir: false,    // valid au runtime
  },
};

export default nextConfig;
