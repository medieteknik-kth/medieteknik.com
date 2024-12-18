import { NextConfig } from 'next'
import {
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
            key: 'Content-Security-Policy',
            value: `
              default-src 'self' http://localhost:3000 https://medieteknik.com; 
              script-src 'self' https://vercel.live 'unsafe-eval' 'unsafe-inline'; 
              connect-src 'self' localhost:80 http://localhost:* https://api.medieteknik.com https://vercel.live wss://ws-us3.pusher.com blob:; 
              media-src blob: http://localhost:3000; 
              img-src 'self' https://storage.googleapis.com https://vercel.live https://vercel.com https://i.ytimg.com data: blob:; 
              style-src 'self' https://vercel.live 'unsafe-inline'; 
              font-src 'self' https://vercel.live https://assets.vercel.com; 
              frame-src 'self' https://www.youtube.com/ https://www.instagram.com https://vercel.live; 
              object-src 'none'; 
              base-uri 'none'; 
              form-action 'self'; 
              frame-ancestors 'none'; 
              manifest-src 'self'; 
              worker-src 'self'; 
              script-src-elem 'self' 'unsafe-inline' https://vercel.live;`.replace(
              /\s+/g,
              ' '
            ),
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

  webpack(config: any): NextJsWebpackConfig {
    config.infrastructureLogging = {
      level: 'error',
    }

    interface FileLoaderRule {
      test?: RegExp
      issuer?: any
      exclude?: RegExp
      resourceQuery?: any
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
