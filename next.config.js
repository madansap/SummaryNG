/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    DB: process.env.DB,
  },
}

module.exports = nextConfig 