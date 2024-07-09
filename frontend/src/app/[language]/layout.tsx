import type { Metadata, Viewport } from 'next'
import { Figtree, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { supportedLanguages } from '../i18n/settings'
import { CookiesProvider } from 'next-client-cookies/server'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { dir } from 'i18next'
import CookiePopup from '@/components/cookie/Cookie'
import {
  Icon,
  IconDescriptor,
} from 'next/dist/lib/metadata/types/metadata-types'
import { fontFigtree } from '../fonts'

export async function generateStaticParams() {
  return supportedLanguages.map((language) => ({ language }))
}

export const metadata: Metadata = {
  title: 'Medieteknik | KTH',
  description: 'Medieteknik Site',
  other: {
    'msapplication-TileColor': '#ffffff',
  },
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
    <html
      lang={language}
      dir={dir(language)}
      className={`${fontFigtree.className}`}
    >
      <head />
      <body className='min-w-full min-h-screen bg-background font-sans antialiased'>
        <CookiesProvider>
          <Providers>
            <Header language={language} />
            {children}
            <Footer language={language} />
            <CookiePopup params={{ language }} />
          </Providers>
        </CookiesProvider>
      </body>
    </html>
  )
}
