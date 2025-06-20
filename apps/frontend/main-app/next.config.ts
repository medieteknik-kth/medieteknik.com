import type { NextConfig } from 'next'
import type {
  ExperimentalConfig,
  NextJsWebpackConfig,
} from 'next/dist/server/config-shared'

const experimentalConfig: ExperimentalConfig = {}

const nextConfig: NextConfig = {
  experimental: experimentalConfig,

  turbopack: {
    moduleIds: 'named',
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.ts',
      },
    },
  },

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
      {
        hostname: 'i.ytimg.com',
        protocol: 'https',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Permissions-Policy',
            value:
              'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), usb=(), fullscreen=(self "https://*.youtube-nocookie.com"), autoplay=(), payment=(self)',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-site',
          },
        ],
      },
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },

  // biome-ignore lint/suspicious/noExplicitAny: This is a Next.js type
  webpack(config: any): NextJsWebpackConfig {
    config.infrastructureLogging = {
      level: 'error',
    }

    config.resolve.alias['@shared'] = require('node:path').resolve(
      __dirname,
      '../../shared'
    )

    interface FileLoaderRule {
      test?: RegExp
      // biome-ignore lint/suspicious/noExplicitAny: This is a Next.js type
      issuer?: any
      exclude?: RegExp
      resourceQuery?: RegExp | { not: RegExp[] }
    }

    const fileLoaderRule: FileLoaderRule | undefined = config.module.rules.find(
      (rule: FileLoaderRule) => rule.test?.test?.('.svg')
    )

    if (fileLoaderRule) {
      // Exclude SVGs from the existing rule
      fileLoaderRule.exclude = /\.svg$/i

      // Add new rule for handling SVGs with `@svgr/webpack`
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [/url/] },
        use: ['@svgr/webpack'],
      })

      // Add or adjust rule for using SVGs as URLs
      config.module.rules.push({
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      })
    }
    return config
  },
} satisfies NextConfig

if (process.env.ANALYZE) {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })
  module.exports = withBundleAnalyzer(nextConfig)
}

export default nextConfig
