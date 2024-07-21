import './globals.css'
import type { Metadata, Viewport } from 'next'
import { dir } from 'i18next'
import { supportedLanguages } from '../i18n/settings'
import { CookiesProvider } from 'next-client-cookies/server'
import { fontFigtree } from '../fonts'
import Providers from '@providers/providers'
import { LanguageCodes } from '@/utility/Constants'
import CookiePopup from '@/components/cookie/Cookie'
import ErrorBoundary from '@/components/error/ErrorBoundary'
import ErrorFallback from '@/components/error/ErrorFallback'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

/**
 * Generates the static paths for each language ({@link LanguageCodes})
 * @async
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 * @returns {Promise<{ language: LanguageCodes }[]>}
 */
export async function generateStaticParams(): Promise<
  { language: LanguageCodes }[]
> {
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

interface Params {
  language: LanguageCodes
}

interface Props {
  children: React.ReactNode
  params: Params
}

/**
 * The Root of the frontend app
 *
 * @param {React.ReactNode} children - The children of the root
 * @param {Params} params - The params of the root
 * @param {string} params.language - The language of the root
 * @returns {JSX.Element} The rendered root
 */
export default function RootLayout({ children, params }: Props): JSX.Element {
  children
  return (
    <html
      lang={params.language}
      dir={dir(params.language)}
      className={`${fontFigtree.className}`}
    >
      <head />
      <body className='min-w-full min-h-screen bg-background font-sans antialiased'>
        <CookiesProvider>
          <Providers language={params.language}>
            <Header language={params.language} />
            <ErrorBoundary fallback={<ErrorFallback />}>
              {children}
            </ErrorBoundary>
            <Footer language={params.language} />
            <CookiePopup params={params} />
          </Providers>
        </CookiesProvider>
      </body>
    </html>
  )
}
