/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        undici: false,
      };
    }
    return config;
  },
  experimental: {
    // Remove serverActions flag as it's enabled by default now
    serverComponentsExternalPackages: ['better-sqlite3']
  },
  env: {
    DB: process.env.DB,
  },
}

module.exports = nextConfig 