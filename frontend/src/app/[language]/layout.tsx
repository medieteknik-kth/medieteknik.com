import CookiePopup from '@/components/cookie/Cookie'
import ErrorBoundary from '@/components/error/ErrorBoundary'
import ErrorFallback from '@/components/error/ErrorFallback'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { Toaster } from '@/components/ui/toaster'
import { LanguageCode } from '@/models/Language'
import ClientProviders from '@/providers/ClientProviders'
import { dir } from 'i18next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { fontFigtree } from '../fonts'
import { supportedLanguages } from '../i18n/settings'
import './globals.css'

import type { JSX } from 'react'

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
  title: {
    template: '%s | Medieteknik - KTH',
    default: 'Medieteknik - KTH',
  },
  description:
    'Student på KTH? Här hittar du allt du behöver veta om medieteknik på KTH.',
  keywords: 'KTH, Medieteknik, Media Technology, Kungliga Tekniska Högskolan',
  alternates: {
    canonical: 'https://www.medieteknik.com',
    languages: {
      sv: 'https://www.medieteknik.com/sv',
      en: 'https://www.medieteknik.com/en',
    },
  },
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
  params: Promise<Params>
  modal: React.ReactNode
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
export default async function RootLayout(props: Props): Promise<JSX.Element> {
  const params = await props.params

  const { children, modal } = props

  return (
    <>
      <ClientProviders language={params.language}>
        <Header language={params.language} />
        <ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>
        <Footer language={params.language} />
        <CookiePopup language={params.language} />
        <Toaster />
        {modal}
      </ClientProviders>
      <Script id='language-attributes'>
        {`
            document.documentElement.lang = "${params.language}";
            document.documentElement.dir = "${dir(params.language)}";
            document.documentElement.className = "${fontFigtree.className}";
            document.body.className = "${
              fontFigtree.className
            } min-w-full min-h-screen bg-background font-sans antialiased";
            `}
      </Script>
    </>
  )
}
