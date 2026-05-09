/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 如果你要部署到 GitHub Pages 的子路径（如 username.github.io/blog），取消下面注释：
  // basePath: '/blog',
}

module.exports = nextConfig
