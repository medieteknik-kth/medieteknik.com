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
}

export default nextConfig
