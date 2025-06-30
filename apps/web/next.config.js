/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  experimental: {
    turbo: {
      rules: {},
    },
  },
  images: {
    domains: ['nrxemenkpeejarhejbbk.supabase.co'],
  },
};

export default nextConfig;
