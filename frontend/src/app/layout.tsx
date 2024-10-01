import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { fontFigtree } from './fonts'
import Head from 'next/head'

interface Props {
  children: React.ReactNode
}

/**
 * @name RootLayout
 * @description The root layout component, top level component for all pages
 *
 * @param {React.ReactNode} children - The children to render
 * @returns {JSX.Element} The root layout component
 */
export default function RootLayout({ children }: Props): React.ReactElement {
  return (
    <html suppressHydrationWarning>
      <Head>
        <meta
          key='google-adsense'
          name='google-adsense-account'
          content='ca-pub-2106963438710910'
        />
      </Head>
      <body
        style={{
          fontFamily: "'Figtree', sans-serif",
        }}
      >
        <SpeedInsights />
        <Analytics />
        {children}
      </body>
    </html>
  )
}
