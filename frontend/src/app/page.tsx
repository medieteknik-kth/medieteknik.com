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
      </div>
      <Footer />
    </main>
  )
}
