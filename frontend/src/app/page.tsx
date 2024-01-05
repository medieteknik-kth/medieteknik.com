import Image from 'next/image'
import Header from './components/header/header'
import Footer from './components/footer/footer'
import Background from '/public/images/bg.jpg'

export default function Home() {
  return (
    <main>
      <Header />
      <div className='w-full h-[1024px]'>
        <div className='w-full h-full absolute -z-10 top-0'>
          <Image src={Background.src} alt='bg' layout='fill' objectFit='cover' />
        </div>
        <div className='w-full h-full z-10 flex justify-center'>
          <div className='w-1/2 h-full flex flex-col items-center justify-center'>
            <h1 className='text-7xl text-yellow-400 font-semibold tracking-wide p-8'>MEDIETEKNIK</h1>
            <h2 className='text-2xl text-white tracking-widest'>KUNGLIGA TEKNISKA HÖGSKOLAN</h2>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
