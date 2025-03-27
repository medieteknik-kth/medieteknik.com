import type { NextConfig } from 'next'
import type { ExperimentalConfig } from 'next/dist/server/config-shared'

const experimentalConfig: ExperimentalConfig = {
  turbo: {
    moduleIdStrategy: 'named',
  },
  allowedDevOrigins: ['app.localhost'],
}

const nextConfig: NextConfig = {
  experimental: experimentalConfig,

  images: {
    remotePatterns: [
      {
        hostname: 'storage.googleapis.com',
        protocol: 'https',
        pathname: '/medieteknik-static/**',
      },
      {
        hostname: 'www.medieteknik.com',
        protocol: 'https',
      },
    ],
  },
}

export default nextConfig
