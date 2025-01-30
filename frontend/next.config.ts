import type { NextConfig } from 'next'
import type {
  ExperimentalConfig,
  NextJsWebpackConfig,
} from 'next/dist/server/config-shared'

const experimentalConfig: ExperimentalConfig = {
  turbo: {
    moduleIdStrategy: 'named',
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.ts',
      },
    },
  },
}

const nextConfig: NextConfig = {
  experimental: experimentalConfig,

  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        hostname: 'storage.googleapis.com',
        protocol: 'https',
        port: '',
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
    ]
  },

  // biome-ignore lint/suspicious/noExplicitAny: This is a Next.js type
  webpack(config: any): NextJsWebpackConfig {
    config.infrastructureLogging = {
      level: 'error',
    }

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

export default nextConfig
