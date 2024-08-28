import Image from 'next/image'
import About from './about'
import Background from '/public/images/bg2.webp'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/app/i18n'
import './home.css'

export default async function Home({
  params: { language },
}: {
  params: { language: string }
}) {
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
            src={Background}
            alt='Background'
            fill
            sizes='100vh'
            className='w-full h-full object-cover'
            priority
            placeholder='blur'
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
            <h1 className='w-fit  h-fit text-2xl xxs:text-4xl xs:text-6xl md:text-8xl text-yellow-400 font-semibold tracking-wide py-8 uppercase grid place-items-center'>
              {t('title')}
            </h1>
            <h2 className='w-full md:w-[600px] lg:w-[800px] h-8 text-md xxs:text-xl sm:text-2xl text-white tracking-widest uppercase'>
              {t('school')}
            </h2>
          </div>
        </div>
      </div>
      <About language={language} />
    </main>
  )
}
