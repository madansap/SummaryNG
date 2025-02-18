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
        undici: false,
        sqlite3: false,
        'better-sqlite3': false
      };
    }
    return config;
  },
  experimental: {
    // External packages that should not be bundled
    serverComponentsExternalPackages: ['better-sqlite3', 'sqlite3']
  },
  env: {
    DB: process.env.DB,
  },
}

module.exports = nextConfig 