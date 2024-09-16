import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

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
      <head>
        <meta name='google-adsense-account' content='ca-pub-2106963438710910' />
        <link
          rel='preload'
          href='https://storage.googleapis.com/medieteknik-static/static/landingpage.webp'
          as='image'
        />
      </head>
      <body>
        <SpeedInsights />
        <Analytics />
        {children}
      </body>
    </html>
  )
}
