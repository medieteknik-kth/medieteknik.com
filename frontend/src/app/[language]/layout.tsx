import type { Metadata, Viewport } from 'next'
import { Figtree } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { supportedLanguages } from '../i18n/settings'
import { CookiesProvider } from 'next-client-cookies/server'

import { dir } from 'i18next'
import CookiePopup from '@/components/cookie/Cookie'
import Favicon from 'public/favicon.ico'
import {
  Icon,
  IconDescriptor,
} from 'next/dist/lib/metadata/types/metadata-types'

export async function generateStaticParams() {
  return supportedLanguages.map((language) => ({ language }))
}

export const metadata: Metadata = {
  title: 'Medieteknik | KTH',
  description: 'Medieteknik Site',
  icons: [{ rel: 'icon', type: 'image/ico', url: Favicon.src }],
}

export const viewport: Viewport = {
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

const figtree = Figtree({ subsets: ['latin'] })

export default function RootLayout({
  children,
  params: { language },
}: {
  children: React.ReactNode
  params: { language: string }
}) {
  children
  return (
    <html
      lang={language}
      dir={dir(language)}
      style={{ scrollPaddingTop: '100px' }}
    >
      <head>
        {Array.isArray(metadata.icons) &&
          metadata.icons.map((icon: Icon) => (
            <link
              rel={(icon as IconDescriptor).rel}
              href={(icon as IconDescriptor).url.toString()}
              key={(icon as IconDescriptor).rel}
            />
          ))}
      </head>
      <body className={figtree.className}>
        <CookiesProvider>
          <Providers>
            {children}
            <CookiePopup params={{ language }} />
          </Providers>
        </CookiesProvider>
      </body>
    </html>
  )
}
