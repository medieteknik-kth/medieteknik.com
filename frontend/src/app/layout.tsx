import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Metadata } from 'next'
import { CustomProvider } from 'rsuite'
import 'rsuite/dist/rsuite-no-reset.min.css'

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
export default function RootLayout({ children }: Props): React.ReactElement {
  return (
    <html suppressHydrationWarning>
      <body>
        <SpeedInsights />
        <Analytics />
        <CustomProvider>{children}</CustomProvider>
      </body>
    </html>
  )
}
