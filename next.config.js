/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle client-side dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        perf_hooks: false
      };
    }
    return config;
  },
  images: {
    domains: ['pysdzwzkikklnrayqqat.supabase.co'],
  },
  env: {
    DB: process.env.DB,
  },
}

module.exports = nextConfig 