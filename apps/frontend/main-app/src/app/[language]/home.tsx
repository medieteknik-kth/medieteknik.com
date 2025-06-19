import About from '@/app/[language]/about'
import { useTranslation } from '@/app/i18n'
import type { LanguageCode } from '@/models/Language'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import BlurredBG from 'public/images/landingpage_blurred.webp'
import type { JSX } from 'react'
import './home.css'

interface Props {
  params: Promise<{
    language: LanguageCode
  }>
}

/**
 * @name Home
 * @description The home page
 *
 * @param {object} params - The dynamic route parameters
 * @param {string} params.language - The language code
 * @returns {Promise<JSX.Element>} The home page
 */
export default async function Home(props: Props): Promise<JSX.Element> {
  const { language } = await props.params

  const { t } = await useTranslation(language, 'common')

  return (
    <main>
      <div className='w-full h-screen min-h-[600px] max-h-[2400px]'>
        <div
          id='background'
          className='w-full min-h-[600px] max-h-[2400px] absolute grid place-items-center -z-10 top-0'
        >
          <div className='w-full h-full bg-black/40 z-10' />
          <Image
            src='https://storage.googleapis.com/medieteknik-static/static/landingpage_2019.webp'
            alt='Background'
            fill
            className='w-full h-full object-cover'
            priority
            placeholder='blur'
            blurDataURL={BlurredBG.src}
            loading='eager'
          />
          <ChevronDownIcon className='w-16 h-fit absolute bottom-4 left-0 right-0 mx-auto text-white animate-bounce z-20 motion-reduce:animate-none duration-[1500ms]' />
        </div>
        <div className='w-full h-full grid place-items-center'>
          <div className='w-full text-center uppercase'>
            <h1
              className='text-yellow-400 font-semibold leading-tight'
              style={{
                fontSize: 'clamp(2rem, 4vw + 1rem, 8rem)',
              }}
            >
              {t('title')}
            </h1>
            <h2
              className='text-white'
              style={{
                fontSize: 'clamp(1rem, 0.5vw + 1rem, 3rem)',
              }}
            >
              {t('school')}
            </h2>
          </div>
        </div>
      </div>
      <About language={language} />
    </main>
  )
}
