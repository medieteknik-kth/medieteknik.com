import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

import LoginWrapper from '@/app/[language]/login/client/loginWrapper'
import type { LanguageCode } from '@/models/Language'
import type { JSX } from 'react'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

/**
 * @name Login
 * @description The login page with a login form and alternative login methods
 *
 * @param {Params} params - The dynamic URL parameters
 * @param {string} params.language - The language code
 * @returns {Promise<JSX.Element>} The login page
 */
export default async function Login(props: Props): Promise<JSX.Element> {
  const { language } = await props.params
  const { t } = await useTranslation(language, 'login')

  return (
    <main>
      <HeaderGap />
      <div className='w-full h-[1080px] flex justify-center items-center dark:bg-[#111]'>
        <div className='w-full max-w-[1440px] h-3/4 flex flex-col items-center'>
          <Link href='/' title='Home' aria-label='Home'>
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/light_logobig.webp'
              alt='light logo'
              width={384}
              height={154}
              priority
              className='w-auto h-16 xss:h-28 xs:h-auto xs:min-w-[384px] dark:hidden'
            />
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/dark_logobig.webp'
              alt='dark logo'
              width={384}
              height={154}
              priority
              className='w-auto h-16 xss:h-28 xs:h-auto xs:min-w-[384px] hidden dark:block'
            />
          </Link>
          <LoginWrapper language={language} />
        </div>
      </div>
    </main>
  )
}
