import ClientWrapper from '@/components/client/ClientWrapper'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { Toaster } from '@/components/ui/toaster'
import type { LanguageCode } from '@/models/Language'
import { SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { dir } from 'i18next'
import type { Viewport } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import type { JSX } from 'react'

interface Params {
  language: LanguageCode
}

interface Props {
  children: React.ReactNode
  params: Promise<Params>
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

export default async function RootLayout(props: Props): Promise<JSX.Element> {
  const { language } = await props.params
  const { children } = props
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

      <Header language={language} />
      <ClientWrapper>{children}</ClientWrapper>
      <Footer language={language} />

      <Script id='language-attributes' nonce={nonce ?? ''}>
        {`document.documentElement.lang = "${language}";
document.documentElement.dir = "${dir(language)}";`}
      </Script>
      <Toaster />
    </>
  )
}
