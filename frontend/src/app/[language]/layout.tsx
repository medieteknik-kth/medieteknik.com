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
 * @name generateStaticParams
 * @description Generates the static paths for each language ({@link LanguageCode})
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
  description:
    'Student på KTH? Här hittar du allt du behöver veta om medieteknik på KTH.',
  other: {
    'msapplication-TileColor': '#ffffff',
    'google-adsense-account': 'ca-pub-2106963438710910',
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
 * @name RootLayout
 * @description The dynamic root layout component, top level component for all *most* pages excluding non-language specific pages
 *
 * @param {Props} props - The props to pass to the component
 * @param {React.ReactNode} props.children - The children to render
 * @param {Params} props.params - The parameters to pass to the component
 * @param {LanguageCode} props.params.language - The language code
 *
 * @returns {JSX.Element} The root layout component
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
