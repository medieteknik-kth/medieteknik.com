import Image from 'next/image'
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
      <div className='w-full h-screen'>
        <div className='w-full h-full max-h-[2400px] absolute flex justify-center items-center -z-10 top-0'>
          <Image
            src={Background}
            alt='bg'
            className='w-full h-screen object-cover'
            priority
            placeholder='blur'
            blurDataURL={Background.src}
          />
          <ChevronDownIcon className='w-16 h-16 absolute bottom-0 left-0 right-0 mx-auto text-white' />
        </div>
        <div className='w-full h-full z-10 flex flex-col items-center justify-center'>
          <div className='w-9/12 h-full flex flex-col items-center justify-center text-center'>
            <h1 className='text-xl xs:text-4xl sm:text-7xl text-yellow-400 font-semibold tracking-wide py-8 uppercase'>
              {common('title')}
            </h1>
            <h2 className='text-xl sm:text-2xl text-white tracking-widest uppercase'>
              {t('school')}
            </h2>
          </div>
        </div>
      </div>
      <About />
      <News />
    </main>
  )
}
