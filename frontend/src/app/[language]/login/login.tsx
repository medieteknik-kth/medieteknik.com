import AlternativeLogin from '@/app/[language]/login/client/alternative'
import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import Image from 'next/image'
import Link from 'next/link'
import LoginForm from './client/loginForm'

import type { JSX } from 'react'
import { LanguageCode } from '@/models/Language'

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
          <div className='w-11/12 h-fit pb-4 xs:mx-20 xs:px-10 border-b mt-8 text-lg'>
            <h1 className='text-3xl md:text-5xl uppercase font-bold tracking-wider text-[#111] dark:text-white text-center mb-8'>
              {t('login')}
            </h1>
            <LoginForm language={language} />
          </div>

          <div className='text-lg mt-4'>
            <AlternativeLogin language={language} />
          </div>
        </div>
      </div>
    </main>
  )
}
