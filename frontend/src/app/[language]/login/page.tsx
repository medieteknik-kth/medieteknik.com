import Image from 'next/image'

import LogoBig from 'public/images/logobig.png'

import KTHSVG from 'public/images/svg/kth.svg'
import Link from 'next/link'

export default function Login({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main>
      <div className='h-24 bg-black' />
      <div className='w-full h-[1080px] flex justify-center items-center'>
        <div className='w-full xs:w-1/2 h-3/4 max-w-[1440px] flex flex-col items-center'>
          <Link href='/' title='Home' aria-label='Home'>
            <Image
              src={LogoBig}
              alt='logo'
              width={384}
              height={154}
              priority
              className='w-auto h-16 xss:h-28 xs:h-auto xs:min-w-[384px]'
            />
          </Link>
          <div className='w-full xs:min-w-[300px] md:min-w-[600px] h-1/2 grid place-items-center'>
            <h1 className='text-5xl uppercase font-bold tracking-wider text-[#111]'>
              Login
            </h1>
            <form className='w-full h-full flex flex-col justify-between pb-8'>
              <input
                type='text'
                placeholder='Username'
                className='w-full h-1/3 border-2 pl-4 border-yellow-400 rounded-lg text-lg xs:text-xl'
              />
              <input
                type='password'
                placeholder='Password'
                className='w-full h-1/3 border-2 pl-4 border-yellow-400 rounded-lg text-lg xs:text-xl'
              />
              <button
                type='submit'
                className='w-full h-12 bg-yellow-400 text-black uppercase tracking-wide rounded-lg font-bold hover:bg-yellow-500 text-xl'
              >
                Login
              </button>
            </form>
          </div>

          <div className='w-full xs:min-w-[300px] md:min-w-[600px] flex flex-col items-center'>
            <h2 className='w-full text-2xl text-center uppercase tracking-wider py-8 border-t-2 border-black'>
              Alternative Login Methods
            </h2>
            <ul className='w-full grid grid-cols-1 place-items-center'>
              <li className='w-20 h-20'>
                <button
                  className='w-full h-full'
                  title='KTH Login'
                  aria-label='KTH Login'
                >
                  <KTHSVG width={80} height={80} />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
