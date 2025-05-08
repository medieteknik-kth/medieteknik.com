import ClientWrapper from '@/components/client/ClientWrapper'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/providers/Providers'
import { SUPPORTED_LANGUAGES } from '@/utility/Constants'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { dir } from 'i18next'
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import type { JSX } from 'react'

interface Params {
  language: LanguageCode
}

interface Props {
  children: React.ReactNode
  params: Promise<Params>
  modal: React.ReactNode
}

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

export const viewport: Viewport = {
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const value = 'RGBank'

  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
  return {
    title: {
      default: `${capitalizedValue} - Medieteknik`,
      template: `%s | ${capitalizedValue} - Medieteknik`,
    },
    // This app shouldn't be indexed by search engines
    robots: {
      index: false,
      follow: false,
    },
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

      <Providers language={language}>
        <Header language={language} />
        <ClientWrapper>{children}</ClientWrapper>
        <Footer language={language} />
        {modal}
      </Providers>

      <Script id='language-attributes' nonce={nonce ?? ''}>
        {`document.documentElement.lang = "${language}";
document.documentElement.dir = "${dir(language)}";`}
      </Script>
      <Toaster />
    </>
  )
}
