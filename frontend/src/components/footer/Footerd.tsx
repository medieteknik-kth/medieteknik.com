import React from 'react'
import { useTranslation } from '../../app/i18n'
import Link from 'next/link'

import Logo from 'public/images/logobig.png'
import FacebookSVG from 'public/images/svg/facebook.svg'
import InstagramSVG from 'public/images/svg/instagram.svg'
import LinkedInSVG from 'public/images/svg/linkedin.svg'
import YoutubeSVG from 'public/images/svg/youtube.svg'

import Image from 'next/image'

export default async function FooterRedesign({
  params: { language },
}: {
  params: { language: string }
}) {
  const { t } = await useTranslation(language, 'footer')

  return (
    <footer className='w-screen h-[720px] xl:h-[420px] text-sm flex flex-col items-center justify-center xl:justify-between border-t-2'>
      <div className='w-full h-full md:h-3/5 flex flex-col md:flex-row justify-around items-center'>
        <Image
          src={Logo}
          alt='logo'
          width={1000}
          height={400}
          className='h-20 xxs:h-32'
        />
        <div className='w-3/5 h-full flex items-center justify-center'>
          <ul className='w-96 xl:w-full h-full xl:h-1/2 flex flex-col xl:flex-row justify-evenly'>
            <li className='w-full xl:w-1/4 border-t-2 mb-8 md:mb-0 border-yellow-400 pt-4 px-4'>
              <h2 className='text-2xl text-center xxs:text-left tracking-wider font-bold'>
                {t('location')}
              </h2>
              <p className='mt-4 text-center xxs:text-left'>
                Drotting Kristinas väg 15 <br /> 100 44 Stockholm
              </p>
            </li>
            <li className='w-full xl:w-1/4  border-t-2 mb-8 md:mb-0  border-yellow-400 pt-4 px-4'>
              <h2 className='text-2xl text-center xxs:text-left tracking-wider font-bold'>
                {t('contact')}
              </h2>
              <p className='text-center xxs:text-left mt-4'>
                <a
                  href='mailto:info@medieteknik.com'
                  className=' text-blue-500'
                  title='Email'
                  aria-label={`${t('contact')} email`}
                  aria-description='Email Link: info@medieteknik.com'
                >
                  info@medieteknik.com
                </a>
              </p>
            </li>
            <li className='w-full xl:w-1/4 border-t-2 mb-8 md:mb-0  border-yellow-400 pt-4 px-4'>
              <h2 className='text-2xl text-center xxs:text-left tracking-wider font-bold'>
                {t('connect')}
              </h2>
              <ul className='w-full h-full mt-2 grid place-items-center xxs:place-items-start grid-cols-2 grid-rows-2 xxs:grid-cols-4 xxs:grid-rows-1 *:cursor-pointer *:p-2 xxs:-ml-2'>
                <li
                  className='*:hover:fill-yellow-400 *:transition-colors'
                  title='Facebook'
                  aria-label='Facebook'
                  aria-description='Social Media Link: Facebook'
                >
                  <Link
                    href='http://www.facebook.com/medieteknik.kth'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full h-full'
                  >
                    <FacebookSVG width={32} height={32} />
                  </Link>
                </li>
                <li
                  className='*:hover:fill-yellow-400 *:transition-colors'
                  title='Instagram'
                  aria-label='Instagram'
                  aria-description='Social Media Link: Instagram'
                >
                  <Link
                    href='https://www.instagram.com/medieteknik_kth/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full h-full '
                  >
                    <InstagramSVG width={32} height={32} />
                  </Link>
                </li>
                <li
                  className='*:hover:fill-yellow-400 *:transition-colors'
                  title='LinkedIn'
                  aria-label='LinkedIn'
                  aria-description='Social Media Link: LinkedIn'
                >
                  <Link
                    href='https://www.linkedin.com/company/sektionen-f%C3%B6r-medieteknik-%C2%A0kth/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full h-full'
                  >
                    <LinkedInSVG width={32} height={32} />
                  </Link>
                </li>
                <li
                  className='*:hover:fill-yellow-400 *:transition-colors'
                  title='YouTube'
                  aria-label='YouTube'
                  aria-description='Social Media Link: YouTube'
                >
                  <Link
                    href='https://www.youtube.com/channel/UCfd-63pepDHT9uZku8KbQTA'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full h-full'
                  >
                    <YoutubeSVG width={32} height={32} />
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <p className='mb-8 h-1/3 pt-8 px-8 text-xs xs:text-sm xs:pt-16 xs:px-16 flex items-center sm:h-fit'>
        {t('copyright')}
      </p>
    </footer>
  )
}
