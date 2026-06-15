/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      { source: '/app/home', destination: '/', permanent: false },
      { source: '/admin/dashboard', destination: '/admin', permanent: false },
    ]
  },
}
module.exports = nextConfig
