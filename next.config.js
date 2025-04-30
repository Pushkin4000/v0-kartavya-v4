/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // This is to handle the @ alias in imports
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": __dirname,
    }
    return config
  },
}

module.exports = nextConfig
