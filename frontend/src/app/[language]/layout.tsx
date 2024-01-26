import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CookiesProvider } from 'next-client-cookies/server';
import { supportedLanguages } from '../i18n/settings'
import { dir } from 'i18next'
import CookiePopup from '@/components/cookie/Cookie'

export async function generateStaticParams() {
  return supportedLanguages.map((language) => ({ language }))
}

export const metadata: Metadata = {
  title: 'Medieteknik | KTH',
  description: 'Medieteknik Site',
}

export const viewport: Viewport = {
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
      <head />
      <body>
        <CookiesProvider>
          {children}
          <CookiePopup params={{ language }} />
        </CookiesProvider>
      </body>
    </html>
  )
}
