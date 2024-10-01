import Image from 'next/image'
import BlurredBG from 'public/images/landingpage_blurred.webp'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import './home.css'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Loading from '@/components/tooltips/Loading'
import { useTranslation } from '../i18n'

const About = dynamic(() => import('./about'), { ssr: true })

interface Props {
  params: {
    language: string
  }
}

/**
 * @name Home
 * @description The home page
 *
 * @param {object} params - The dynamic route parameters
 * @param {string} params.language - The language code
 * @returns {Promise<JSX.Element>} The home page
 */
export default async function Home({
  params: { language },
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'common')

  return (
    <main>
      <div className='w-full h-screen min-h-[600px] max-h-[2400px]'>
        <div
          id='background'
          className='w-full min-h-[600px] max-h-[2400px] absolute grid place-items-center -z-10 top-0 shadow-lg shadow-black'
        >
          <div className='w-full h-full bg-black/40 z-10' />
          <Image
            src='https://storage.googleapis.com/medieteknik-static/static/landingpage.webp'
            alt='Background'
            fill
            sizes='(max-width: 768px) 100vw, 100vw'
            className='w-full h-full object-cover'
            priority
            placeholder='blur'
            blurDataURL={BlurredBG.src}
            loading='eager'
          />
          <ChevronDownIcon
            className='w-16 h-fit absolute bottom-4 left-0 right-0 mx-auto text-white animate-bounce z-20'
            style={{
              animationDuration: '1500ms',
            }}
          />
        </div>
        <div className='w-full h-full grid place-items-center'>
          <div className='w-9/12 h-[300px] lg:h-[200px] flex flex-col items-center justify-center text-center'>
            <h1 className='w-fit h-fit text-2xl xxs:text-4xl xs:text-6xl md:text-8xl text-yellow-400 font-semibold tracking-wide py-8 uppercase grid place-items-center'>
              {t('title')}
            </h1>
            <h2 className='w-full md:w-[600px] lg:w-[800px] h-8 text-md xxs:text-xl sm:text-2xl text-white tracking-widest uppercase'>
              {t('school')}
            </h2>
          </div>
        </div>
      </div>
      <Suspense fallback={<Loading language={language} />}>
        <About language={language} />
      </Suspense>
    </main>
  )
}
