import React from 'react'
import { useTranslation } from '../../app/i18n'
import Link from 'next/link'

import Logo from 'public/images/logobig.png'
import FacebookSVG from 'public/images/svg/facebook.svg'
import InstagramSVG from 'public/images/svg/instagram.svg'
import LinkedInSVG from 'public/images/svg/linkedin.svg'
import YoutubeSVG from 'public/images/svg/youtube.svg'
import MBDSVG from 'public/images/svg/mbd.svg'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

import Image from 'next/image'

function ConnectSection({ t }: { t: (key: string) => string }) {
  const linkStyle = '*:hover:fill-yellow-400 *:transition-colors'
  return (
    <ul className='w-full mt-2 grid place-items-center grid-cols-2 grid-rows-1 xs:grid-cols-5 *:cursor-pointer *:p-2 xxs:-ml-2'>
      <li className={linkStyle} title='Facebook'>
        <Link
          href='http://www.facebook.com/medieteknik.kth'
          target='_blank'
          rel='noopener noreferrer'
          className='w-full h-full'
          aria-label="Links to Medieteknik's Facebook page"
          aria-description='Social Media Link: Facebook'
        >
          <FacebookSVG width={30} height={30} />
        </Link>
      </li>
      <li className={linkStyle} title='Instagram'>
        <Link
          href='https://www.instagram.com/medieteknik_kth/'
          target='_blank'
          rel='noopener noreferrer'
          className='w-full h-full'
          aria-label="Links to Medieteknik's Instagram page"
          aria-description='Social Media Link: Instagram'
        >
          <InstagramSVG width={30} height={30} />
        </Link>
      </li>
      <li className={linkStyle} title='LinkedIn'>
        <Link
          href='https://www.linkedin.com/company/sektionen-f%C3%B6r-medieteknik-%C2%A0kth/'
          target='_blank'
          rel='noopener noreferrer'
          className='w-full h-full'
          aria-label="Links to Medieteknik's LinkedIn page"
          aria-description='Social Media Link: LinkedIn'
        >
          <LinkedInSVG width={30} height={30} />
        </Link>
      </li>
      <li className={linkStyle} title='YouTube'>
        <Link
          href='https://www.youtube.com/channel/UCfd-63pepDHT9uZku8KbQTA'
          target='_blank'
          rel='noopener noreferrer'
          className='w-full h-full'
          aria-label="Links to Medieteknik's YouTube page"
          aria-description='Social Media Link: YouTube'
        >
          <YoutubeSVG width={30} height={30} />
        </Link>
      </li>

      <li className={linkStyle} title='Mediesbransch Dag'>
        <Link
          href='https://mediasbranschdag.com'
          target='_blank'
          rel='noopener noreferrer'
          className='w-full h-full'
          aria-label='Links to MBD'
          aria-description='Social Media Link: MBD'
        >
          <MBDSVG width={30} height={30} />
        </Link>
      </li>
    </ul>
  )
}

export default async function Footer({
  params: { language },
}: {
  params: { language: string }
}) {
  const { t } = await useTranslation(language, 'footer')

  return (
    <footer className='w-screen h-[720px] xl:h-[420px] text-sm flex flex-col items-center justify-center xl:justify-between border-t-2'>
      <div className='w-full h-full md:mt-32 lg:mt-0 md:h-4/5 flex flex-col md:flex-row justify-around items-center'>
        <Link
          href='/'
          title='Home'
          aria-label='Home'
          aria-description='Home Link'
        >
          <Image
            src={Logo}
            alt='logo'
            width={384}
            height={154}
            className='w-auto h-14 xxs:h-24 xs:h-32'
          />
        </Link>
        <div className='w-full xxs:px-20 md:px-0 md:w-1/3 xl:w-3/4 h-3/4 xxs:h-full flex items-center justify-around lg:justify-center'>
          <ul className='w-full h-full max-h-80 xl:h-1/2 flex flex-col items-center xl:items-start xl:flex-row space-between xl:justify-around'>
            <li className='w-full xl:w-1/4 border-t-2 mb-8 md:mb-0 border-yellow-400 pt-4 lg:mb-4 px-0 text-center xs:text-left xxs:px-4'>
              <h2 className='text-2xl tracking-wider font-bold'>
                {t('location')}
              </h2>
              <p className='mt-4'>
                Drotting Kristinas väg 15 <br /> 100 44 Stockholm
              </p>
            </li>
            <li className='w-full xl:w-1/4 border-t-2 mb-8 md:mb-0  border-yellow-400 pt-4 lg:mb-4 px-0 xxs:px-4 grid xs:block place-items-center'>
              <h2 className='text-2xl text-center xxs:text-left tracking-wider font-bold'>
                <Link
                  href='/contact'
                  className='w-fit border-b-2 hover:border-black flex items-center'
                >
                  {t('contact')}
                  <ArrowTopRightOnSquareIcon className='w-6 h-6 ml-2 mb-1' />
                </Link>
              </h2>
              <p className='text-center xxs:text-left mt-4'>
                <a
                  href='mailto:info@medieteknik.com'
                  className=' text-sky-800 border-b-2 hover:border-sky-800'
                  title='Email'
                  aria-label={`${t('contact')} email`}
                  aria-description='Email Link: info@medieteknik.com'
                >
                  info@medieteknik.com
                </a>
              </p>
            </li>
            <li className='w-full xl:w-1/4 border-t-2 mb-8 md:mb-0  border-yellow-400 pt-4 px-4'>
              <h2 className='text-2xl text-center xs:text-left tracking-wider font-bold'>
                {t('connect')}
              </h2>
              <ConnectSection t={t} />
            </li>
          </ul>
        </div>
      </div>
      <p className='mb-10 pt-10 xxs:mb-20 px-4 xs:px-20 xxs:px-10 text-xs grid place-items-center'>
        {t('copyright')}
      </p>
    </footer>
  )
}
