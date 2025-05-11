import { fontFigtree } from '@/app/fonts'
import '@medieteknik/tailwindcss-config/globals.css'
import type { Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'

export const metadata: Metadata = {
  title: 'RGBank - Medieteknik',
  description:
    'RGBank is an accounting platform for the Media Technology chapter.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
        <body>{children}</body>
      </html>
    </ViewTransitions>
  )
}
