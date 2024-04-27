import Image from 'next/image'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import About from './about'
import News from './news'
import Background from '/public/images/bg.jpg'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/app/i18n'

export default async function Home({
  params: { language },
}: {
  params: { language: string }
}) {
  const { t } = await useTranslation(language, 'home')

  const common = (await useTranslation(language, 'common')).t
  return (
    <main>
      <Header params={{ language }} />
      <div className='w-screen h-screen min-h-[1080px]'>
        <div className='w-full h-screen min-h-[1080px] absolute flex justify-center items-center -z-10 top-0'>
          <Image
            src={Background}
            alt='bg'
            sizes='(min-height: 1080px) 100vw'
            className='w-full h-screen min-h-[1080px] object-cover'
            priority
            placeholder='blur'
            blurDataURL={Background.src}
          />
        </div>
        <div className='w-screen h-full min-h-[1080px] z-10 flex flex-col items-center justify-center'>
          <div className='w-9/12 h-full flex flex-col items-center justify-center text-center'>
            <h1 className='text-xl xs:text-4xl sm:text-7xl text-yellow-400 font-semibold tracking-wide py-8 uppercase'>
              {common('title')}
            </h1>
            <h2 className='text-xl sm:text-2xl text-white tracking-widest uppercase'>
              {t('school')}
            </h2>
          </div>
          <ChevronDownIcon className='w-16 h-16 text-white' />
        </div>
      </div>
      <About />
      <News />
      <Footer params={{ language }} />
    </main>
  )
}
