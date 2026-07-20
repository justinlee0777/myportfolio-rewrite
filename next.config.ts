import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    turbopackMinify: false,
  },
};

export default nextConfig;
