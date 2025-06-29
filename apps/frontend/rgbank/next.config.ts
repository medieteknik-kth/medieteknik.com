import type { NextConfig } from 'next'
import type { ExperimentalConfig } from 'next/dist/server/config-shared'

const experimentalConfig: ExperimentalConfig = {}

const nextConfig: NextConfig = {
  experimental: experimentalConfig,
  allowedDevOrigins: ['app.localhost'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.medieteknik.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
    ],
  },

  async rewrites() {
    // "Rewrites are applied to client-side routing" - https://nextjs.org/docs/pages/api-reference/config/next-config-js/rewrites
    const apiUrl =
      process.env.NODE_ENV === 'development'
        ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
        : `${process.env.API_URL}/:path*`
    return [
      {
        source: '/api/:path*',
        destination: apiUrl,
      },
    ]
  },
}

export default nextConfig
