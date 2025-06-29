import { useTranslation } from '@/app/i18n'
import CookiePopup from '@/components/cookie/Cookie'
import { ClientErrorBoundary } from '@/components/error/ClientErrorBoundary'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { Toaster } from '@/components/ui/toaster'
import type { LanguageCode } from '@/models/Language'
import ClientProviders from '@/providers/ClientProviders'
import { SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { dir } from 'i18next'
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
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
  const { language } = await props.params
  const { children, modal } = props
  const headerList = await headers()
  const nonce = headerList.get('x-nonce')

  return (
    <>
      <noscript>
        <div className='fixed top-0 left-0 w-full h-full bg-[#121212] dark:bg-white text-white dark:text-black flex items-center justify-center z-50'>
          <h1 className='text-2xl'>
            You need to enable JavaScript to use this site.
          </h1>
        </div>
      </noscript>

      <ClientProviders language={language}>
        {/*<LanguageAlert language={language} />*/}
        <Header language={language} />
        <ClientErrorBoundary>{children}</ClientErrorBoundary>
        <Footer language={language} />
        <CookiePopup language={language} />
        <Toaster />
        {modal}
      </ClientProviders>
      <Script id='language-attributes' nonce={nonce ?? ''}>
        {`document.documentElement.lang = "${language}";
document.documentElement.dir = "${dir(language)}";`}
      </Script>
    </>
  )
}
