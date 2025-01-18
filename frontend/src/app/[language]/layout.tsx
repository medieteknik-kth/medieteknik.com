import CookiePopup from '@/components/cookie/Cookie'
import ErrorBoundary from '@/components/error/ErrorBoundary'
import ErrorFallback from '@/components/error/ErrorFallback'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { Toaster } from '@/components/ui/toaster'
import type { LanguageCode } from '@/models/Language'
import ClientProviders from '@/providers/ClientProviders'
import { dir } from 'i18next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { fontFigtree } from '../fonts'
import { SUPPORTED_LANGUAGES } from '../i18n/settings'
import './globals.css'

import { useTranslation } from '@/app/i18n'
import type React from 'react'
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
  return SUPPORTED_LANGUAGES.map((language) => ({ language }))
}

interface Params {
  language: LanguageCode
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const { t } = await useTranslation(params.language, 'common')
  const value = t('title')

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: {
      default: `${capitalizedValue} - KTH`,
      template: `%s | ${capitalizedValue} - KTH`,
    },
    keywords: t('keywords'),
    description: t('description'),
    alternates: {
      canonical: `https://www.medieteknik.com/${params.language}`,
      languages: {
        sv: 'https://www.medieteknik.com/sv',
        en: 'https://www.medieteknik.com/en',
        'x-default': 'https://www.medieteknik.com',
      },
    },

    other: {
      'msapplication-TileColor': '#ffffff',
      'google-adsense-account': 'ca-pub-2106963438710910',
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
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
      <noscript>
        <div className='fixed top-0 left-0 w-full h-full bg-[#090909] dark:bg-white text-white dark:text-black flex items-center justify-center z-50'>
          <h1 className='text-2xl'>
            You need to enable JavaScript to use this site.
          </h1>
        </div>
      </noscript>
      <ClientProviders language={params.language}>
        <Header language={params.language} />
        <ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>
        <Footer language={params.language} />
        <CookiePopup language={params.language} />
        <Toaster />
        {modal}
      </ClientProviders>
      <Script id='language-attributes'>
        {`document.documentElement.lang = "${params.language}";
document.documentElement.dir = "${dir(params.language)}";
document.documentElement.className = "${fontFigtree.className} bg-neutral-900";`}
      </Script>
      <Script id='theme-attributes' strategy='lazyOnload'>
        {`const theme = window.localStorage.getItem('theme');
document.documentElement.className = "${fontFigtree.className} antialiased" + (theme === 'dark' ? ' dark' : '');
document.body.removeAttribute('class');`}
      </Script>
    </>
  )
}
