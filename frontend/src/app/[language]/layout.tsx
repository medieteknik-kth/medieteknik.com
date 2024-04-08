import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CookiesProvider } from 'next-client-cookies/server'
import { supportedLanguages } from '../i18n/settings'
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

export default function RootLayout({
  children,
  params: { language },
}: {
  children: React.ReactNode
  params: { language: string }
}) {
  children
  return (
    <html lang={language} dir={dir(language)}>
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
      <body>
        <CookiesProvider>
          {children}
          <CookiePopup params={{ language }} />
        </CookiesProvider>
      </body>
    </html>
  )
}
