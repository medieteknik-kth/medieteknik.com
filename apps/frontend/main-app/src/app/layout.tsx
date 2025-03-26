import { fontFigtree } from '@/app/fonts'
import ServiceWorkerRegister from '@/components/services/ServiceWorkerRegister'
import '@shared/styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.medieteknik.com',
    languages: {
      sv: 'https://www.medieteknik.com/sv',
      en: 'https://www.medieteknik.com/en',
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-2106963438710910',
  },
}

/**
 * @name RootLayout
 * @description The root layout component, top level component for all pages
 *
 * @param {React.ReactNode} children - The children to render
 * @returns {JSX.Element} The root layout component
 */
export default function RootLayout({ children }: Props): React.ReactNode {
  return (
    <ViewTransitions>
      <html
        lang='en'
        suppressHydrationWarning
        className={`${fontFigtree.className}`}
        style={{
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <body>
          <ServiceWorkerRegister />
          <SpeedInsights />
          <Analytics />
          {children}
        </body>
      </html>
    </ViewTransitions>
  )
}
