/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui'],
  experimental: {
    turbo: {
      rules: {},
    },
  },
};

export default nextConfig;
