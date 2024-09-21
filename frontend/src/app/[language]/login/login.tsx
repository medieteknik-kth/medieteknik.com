'use client'
import Image from 'next/image'
import KTHSVG from 'public/images/svg/kth.svg'
import Link from 'next/link'
import LoginForm from './client/loginForm'
import { Button } from '@/components/ui/button'

interface Props {
  params: {
    language: string
  }
}

/**
 * @name Login
 * @description The login page
 *
 * @param {object} params - The dynamic route parameters
 * @param {string} params.language - The language code
 * @returns {JSX.Element} The login page
 */
export default function Login({ params: { language } }: Props): JSX.Element {
  const loginKTH = () => {
    const redirectURL =
      process.env.NODE_ENV === 'production'
        ? 'https://api.medieteknik.com/auth'
        : 'http://localhost:3000/auth'
    window.location.href = `${redirectURL}`
  }

  return (
    <main>
      <div className='h-24 bg-black' />
      <div className='w-full h-[1080px] flex justify-center items-center dark:bg-[#111]'>
        <div className='w-full xs:w-1/2 h-3/4 max-w-[1440px] flex flex-col items-center'>
          <Link href='/' title='Home' aria-label='Home'>
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/light_logobig.webp'
              alt='light logo'
              width={384}
              height={154}
              priority
              className='w-auto h-16 xss:h-28 xs:h-auto xs:min-w-[384px] dark:hidden'
            />
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/dark_logobig.webp'
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
                <Button
                  className='w-full h-full'
                  title='KTH Login'
                  aria-label='KTH Login'
                  variant={'ghost'}
                  size={'icon'}
                  onClick={loginKTH}
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
