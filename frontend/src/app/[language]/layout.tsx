import './globals.css'
import type { Metadata, Viewport } from 'next'
import { dir } from 'i18next'
import { supportedLanguages } from '../i18n/settings'
import { fontFigtree } from '../fonts'
import ClientProviders from '@/providers/ClientProviders'
import ServerProviders from '@/providers/ServerProviders'
import CookiePopup from '@/components/cookie/Cookie'
import ErrorBoundary from '@/components/error/ErrorBoundary'
import ErrorFallback from '@/components/error/ErrorFallback'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Script from 'next/script'
import { Toaster } from '@/components/ui/toaster'
import { LanguageCode } from '@/models/Language'

/**
 * Generates the static paths for each language ({@link LanguageCode})
 * @async
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 * @returns {Promise<{ language: LanguageCode }[]>}
 */
export async function generateStaticParams(): Promise<
  { language: LanguageCode }[]
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
  language: LanguageCode
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
    <>
      <ServerProviders>
        <ClientProviders language={params.language}>
          <Header language={params.language} />
          <ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>
          <Footer language={params.language} />
          <CookiePopup params={params} />
          <Toaster />
        </ClientProviders>
      </ServerProviders>
      <Script id='language-attributes'>
        {`
            document.documentElement.lang = "${params.language}";
            document.documentElement.dir = "${dir(params.language)}";
            document.documentElement.className = "${fontFigtree.className}";
            document.body.className = "min-w-full min-h-screen bg-background font-sans antialiased";
            `}
      </Script>
    </>
  )
}
