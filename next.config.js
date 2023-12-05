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
};

module.exports = nextConfig;
