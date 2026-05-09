/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/my-ai-blog',
  assetPrefix: '/my-ai-blog/',
}

module.exports = nextConfig
