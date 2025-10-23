import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's2.loli.net',
      },
    ],
  },

    reactCompiler: true,

};

export default nextConfig;
