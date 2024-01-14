import Image from 'next/image'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Background from '/public/images/bg.jpg'
import { useTranslation } from '@/app/i18n'

export default async function Home({ params: { language } }: { params: { language: string } }) {
  const { t } = await useTranslation(language, 'home')
  return (
    <main>
      <Header params={{ language }} />
      <div className='w-full h-[1024px]'>
        <div className='w-full h-full absolute -z-10 top-0'>
          <Image src={Background.src} alt='bg' fill />
        </div>
        <div className='w-full h-full z-10 flex justify-center'>
          <div className='w-1/2 h-full flex flex-col items-center justify-center'>
            <h1 className='text-7xl text-yellow-400 font-semibold tracking-wide p-8 uppercase'>{t('title')}</h1>
            <h2 className='text-2xl text-white tracking-widest uppercase'>{t('school')}</h2>
          </div>
        </div>
      </div>
      <Footer params={{ language }} />
    </main>
  )
}
