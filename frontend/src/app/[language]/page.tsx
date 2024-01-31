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
      <div className='w-screen h-screen'>
        <div className='w-full h-screen absolute flex justify-center items-center -z-10 top-0'>
          <Image 
          src={Background} 
          alt='bg' 
          sizes='(min-height: 1080px) 100vw' 
          className='w-full h-screen object-cover' 
          priority
          placeholder='blur'
          blurDataURL={Background.src}/>
        </div>
        <div className='w-screen h-full z-10 flex justify-center'>
          <div className='w-9/12 h-full flex flex-col items-center justify-center text-center'>
            <h1 className='text-xl xs:text-4xl sm:text-7xl text-yellow-400 font-semibold tracking-wide py-8 uppercase'>{t('title')}</h1>
            <h2 className='text-xl sm:text-2xl text-white tracking-widest uppercase'>{t('school')}</h2>
          </div>
        </div>
      </div>
      <section id='international' className='w-screen h-screen bg-black'>

      </section>
      <Footer params={{ language }} />
    </main>
  )
}
