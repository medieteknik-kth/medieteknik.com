import React from 'react'
import { useTranslation } from '../../app/i18n'
import Link from 'next/link'

import LightLogo from 'public/images/logobig_light.jpg'
import DarkLogo from 'public/images/logobig_dark.jpg'

import FacebookSVG from 'public/images/svg/facebook.svg'
import InstagramSVG from 'public/images/svg/instagram.svg'
import LinkedInSVG from 'public/images/svg/linkedin.svg'
import YoutubeSVG from 'public/images/svg/youtube.svg'
import MBDSVG from 'public/images/svg/mbd.svg'
import { Button } from '@components/ui/button'

import {
  ArrowTopRightOnSquareIcon,
  EnvelopeIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'

import Image from 'next/image'

function ConnectSection({ t }: { t: (key: string) => string }) {
  const linkStyle = '*:hover:fill-yellow-400 *:transition-colors'

  return (
    <ul className='w-full mt-2 grid place-items-center grid-cols-2 grid-rows-1 xs:grid-cols-5 *:cursor-pointer *:p-2 xxs:-ml-2 fill-[#111] dark:fill-white'>
      <li className={linkStyle} title='Facebook'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='http://www.facebook.com/medieteknik.kth'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full'
            aria-label="Links to Medieteknik's Facebook page"
          >
            <FacebookSVG width={30} height={30} />
          </Link>
        </Button>
      </li>
      <li className={linkStyle} title='Instagram'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='https://www.instagram.com/medieteknik_kth/'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full dark:fill-white'
            aria-label="Links to Medieteknik's Instagram page"
          >
            <InstagramSVG width={30} height={30} />
          </Link>
        </Button>
      </li>
      <li className={linkStyle} title='LinkedIn'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='https://www.linkedin.com/company/sektionen-f%C3%B6r-medieteknik-%C2%A0kth/'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full'
            aria-label="Links to Medieteknik's LinkedIn page"
          >
            <LinkedInSVG width={30} height={30} />
          </Link>
        </Button>
      </li>
      <li className={linkStyle} title='YouTube'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='https://www.youtube.com/channel/UCfd-63pepDHT9uZku8KbQTA'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full'
            aria-label="Links to Medieteknik's YouTube page"
          >
            <YoutubeSVG width={30} height={30} />
          </Link>
        </Button>
      </li>

      <li className={linkStyle} title='Mediesbransch Dag'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='https://mediasbranschdag.com'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full'
            aria-label='Links to MBD'
          >
            <MBDSVG width={30} height={30} />
          </Link>
        </Button>
      </li>
    </ul>
  )
}

export default async function Footer({
  language,
  priority = false,
}: {
  language: string
  priority?: boolean
}) {
  const { t } = await useTranslation(language, 'footer')
  return (
    <footer className='w-full h-fit xl:h-[420px] text-sm flex flex-col items-center justify-center xl:justify-between border-t-2 bg-white text-black border-neutral-200 dark:bg-[#111] dark:text-white dark:border-neutral-700'>
      <div className='w-full h-full mt-8 xl:mt-0 md:h-3/5 flex flex-col md:flex-row justify-around items-center'>
        <Link
          href='/'
          title='Home'
          aria-label='Home'
          className='w-fit h-40 grid place-items-center'
        >
          <Image
            src={DarkLogo}
            alt='logo'
            width={320}
            height={128}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className='w-auto h-14 xxs:h-24 xs:h-auto hidden dark:block'
            placeholder='blur'
          />
          <Image
            src={LightLogo}
            alt='logo'
            width={320}
            height={128}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className='w-auto h-14 xxs:h-24 xs:h-auto block dark:hidden'
            placeholder='blur'
          />
        </Link>
        <div className='w-full h-fit relative xs:px-20 md:px-0 md:w-1/3 xl:w-3/4 xxs:h-full flex items-center justify-around lg:justify-center'>
          <ul className='w-full h-fit xl:mt-2 flex flex-col items-center xl:items-start xl:flex-row space-between xl:justify-around'>
            <li className='w-full h-fit xl:w-1/4 border-t-2 mb-4 lg:mb-8 xl:mb-0 border-yellow-400 pt-4  px-0 text-center xs:text-left xxs:pl-4'>
              <h2 className='text-2xl tracking-wider font-bold'>
                {t('location')}
              </h2>
              <p className='mt-4'>
                Drotting Kristinas väg 15 <br /> 100 44 Stockholm <br />{' '}
                <span className='text-neutral-500 dark:text-neutral-300 text-sm'>
                  c/o THSMEDIES
                </span>
              </p>
            </li>
            <li className='w-full h-fit xl:w-1/4 border-t-2 mb-4 lg:mb-8 xl:mb-0 border-yellow-400 pt-4 px-0 xxs:pl-4 grid xs:flex flex-col place-items-center items-start'>
              <h2 className='w-fit h-fit'>
                <Button
                  asChild
                  variant='link'
                  className='text-2xl text-center xxs:text-left tracking-wider font-bold text-black dark:text-white -ml-4 -mt-2'
                >
                  <Link
                    href='/contact'
                    className='w-fit flex items-center'
                    title='Go to Contact Page'
                    aria-label='Go to Contact Page'
                  >
                    {t('contact')}
                    <ArrowTopRightOnSquareIcon className='w-6 h-6 ml-2 mb-1' />
                  </Link>
                </Button>
              </h2>
              <Button asChild variant='link' className='-ml-4'>
                <Link
                  href='mailto:styrelsen@medieteknik.com'
                  className='flex items-center text-center mt-1 text-sky-800 dark:text-sky-400'
                  title='Email'
                  aria-label={`${t('contact')} email`}
                >
                  <EnvelopeIcon className='w-6 h-6 mr-2 text-black dark:text-white' />
                  <span>styrelsen@medieteknik.com</span>
                </Link>
              </Button>
              <Button asChild variant='link' className='-ml-4'>
                <Link
                  href='tel:802411-5647'
                  className='flex items-center text-center mt-1 text-sky-800 dark:text-sky-400
                  '
                  title='Organisation Number'
                  aria-label={`${t('contact')} phone`}
                >
                  <BuildingOffice2Icon className='w-6 h-6 mr-2 text-black dark:text-white' />
                  <span>802411-5647</span>
                </Link>
              </Button>
            </li>
            <li className='w-full h-fit xl:w-1/4 border-t-2 border-yellow-400 pt-4 pl-4'>
              <h2 className='text-2xl text-center xs:text-left tracking-wider font-bold'>
                {t('connect')}
              </h2>
              <ConnectSection t={t} />
            </li>
          </ul>
        </div>
      </div>
      <p className='pt-10 md:mt-4 xxs:mb-20 px-4 xs:px-20 xxs:px-10 text-xs grid place-items-center'>
        {t('copyright')}
      </p>
    </footer>
  )
}
