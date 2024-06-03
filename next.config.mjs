/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's2.loli.net',
      },
    ],
  },
  experimental: {
    //  reactCompiler: true,
  },
};

export default nextConfig;
