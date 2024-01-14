import type { Metadata } from 'next'
import './globals.css'
import { CookiesProvider } from 'next-client-cookies/server';
import { supportedLanguages } from '../i18n/settings'
import { dir } from 'i18next'

export async function generateStaticParams() {
  return supportedLanguages.map((language) => ({ language }))
}

export const metadata: Metadata = {
  title: 'Medieteknik | KTH',
  description: 'Medieteknik Site',
}

export default function RootLayout({
  children,
  params: { language },
}: {
  children: React.ReactNode
  params: { language: string }
}) {
  return (
    <html lang={language} dir={dir(language)}>
      <head />
      <body>
        <CookiesProvider>
          {children}
        </CookiesProvider>
      </body>
    </html>
  )
}
