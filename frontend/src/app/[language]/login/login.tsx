import Image from 'next/image'
import KTHSVG from 'public/images/svg/kth.svg'
import Link from 'next/link'
import LoginForm from './loginForm'

import LightLogo from 'public/images/logobig_light.jpg'
import DarkLogo from 'public/images/logobig_dark.jpg'
import { Button } from '@/components/ui/button'

export default function Login({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main>
      <div className='h-24 bg-black' />
      <div className='w-full h-[1080px] flex justify-center items-center dark:bg-[#111]'>
        <div className='w-full xs:w-1/2 h-3/4 max-w-[1440px] flex flex-col items-center'>
          <Link href='/' title='Home' aria-label='Home'>
            <Image
              src={LightLogo}
              alt='light logo'
              width={384}
              height={154}
              priority
              className='w-auto h-16 xss:h-28 xs:h-auto xs:min-w-[384px] dark:hidden'
            />
            <Image
              src={DarkLogo}
              alt='dark logo'
              width={384}
              height={154}
              priority
              className='w-auto h-16 xss:h-28 xs:h-auto xs:min-w-[384px] hidden dark:block'
            />
          </Link>
          <div className='w-full xs:min-w-[300px] md:min-w-[600px] h-1/2 grid place-items-center'>
            <h1 className='text-5xl uppercase font-bold tracking-wider text-[#111] dark:text-white'>
              Login
            </h1>
            <LoginForm language={language} />
          </div>

          <div className='w-full xs:min-w-[300px] md:min-w-[600px] flex flex-col items-center'>
            <h2 className='w-full text-2xl text-center uppercase tracking-wider py-8 border-t-2 border-black dark:border-white'>
              Alternative Login Methods
            </h2>

            <ul className='w-full grid grid-cols-1 place-items-center'>
              <li className='text-center'>
                <span className='text-neutral-600 dark:text-neutral-400'>
                  Disabled for now
                </span>
                <Button
                  className='w-full h-full'
                  title='KTH Login'
                  aria-label='KTH Login'
                  aria-disabled
                  variant={'ghost'}
                  size={'icon'}
                  disabled
                >
                  <KTHSVG
                    width={80}
                    height={80}
                    aria-label='KTH Logo'
                    name='KTH Logo'
                  />
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
