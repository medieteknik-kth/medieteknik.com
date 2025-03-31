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

  webpack: (config) => {
    config.resolve.alias['@shared'] = require('node:path').resolve(
      __dirname,
      '../../shared'
    )

    return config
  },
}

export default nextConfig
