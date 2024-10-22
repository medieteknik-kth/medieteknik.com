import { Button } from '@/components/ui/button'
import Link from 'next/link'
import FacebookSVG from 'public/images/svg/facebook.svg'
import InstagramSVG from 'public/images/svg/instagram.svg'
import LinkedInSVG from 'public/images/svg/linkedin.svg'
import MBDSVG from 'public/images/svg/mbd.svg'
import YoutubeSVG from 'public/images/svg/youtube.svg'
import { JSX } from 'react'

/**
 * @name ConnectSection
 * @description Renders the connect section
 *
 * @returns {Promise<JSX.Element>} The connect section
 */
export default async function ConnectSection(): Promise<JSX.Element> {
  const linkStyle = '*:hover:fill-yellow-400 *:transition-colors'

  return (
    <ul className='w-full mt-2 grid place-items-center grid-cols-2 grid-rows-1 xs:grid-cols-5 *:cursor-pointer *:p-2 xxs:-ml-2 fill-[#111] dark:fill-white'>
      <li className={linkStyle} title='Facebook'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='http://www.facebook.com/medieteknik.kth'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full dark:fill-white dark:hover:fill-yellow-400'
            title='Facebook'
            aria-label="Links to Medieteknik's Facebook page"
          >
            <FacebookSVG
              width={30}
              height={30}
              name='Facebook'
              aria-label='Facebook Icon'
              aria-description='Facebook Icon'
            />
          </Link>
        </Button>
      </li>
      <li className={linkStyle} title='Instagram'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='https://www.instagram.com/medieteknik_kth/'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full dark:fill-white dark:hover:fill-yellow-400'
            title='Instagram'
            aria-label="Links to Medieteknik's Instagram page"
          >
            <InstagramSVG
              width={30}
              height={30}
              name='Instagram'
              aria-label='Instagram Icon'
              aria-description='Instagram Icon'
            />
          </Link>
        </Button>
      </li>
      <li className={linkStyle} title='LinkedIn'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='https://www.linkedin.com/company/sektionen-f%C3%B6r-medieteknik-%C2%A0kth/'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full dark:fill-white dark:hover:fill-yellow-400'
            title='LinkedIn'
            aria-label="Links to Medieteknik's LinkedIn page"
          >
            <LinkedInSVG
              width={30}
              height={30}
              name='LinkedIn'
              aria-label='LinkedIn Icon'
              aria-description='LinkedIn Icon'
            />
          </Link>
        </Button>
      </li>
      <li className={linkStyle} title='YouTube'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='https://www.youtube.com/channel/UCfd-63pepDHT9uZku8KbQTA'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full dark:fill-white dark:hover:fill-yellow-400'
            title='YouTube'
            aria-label="Links to Medieteknik's YouTube page"
          >
            <YoutubeSVG
              width={30}
              height={30}
              name='YouTube'
              aria-label='YouTube Icon'
              aria-description='YouTube Icon'
            />
          </Link>
        </Button>
      </li>
      <li className={linkStyle} title='Mediesbransch Dag'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='https://mediasbranschdag.com'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full dark:fill-white dark:hover:fill-yellow-400'
            title='MBD'
            aria-label='Links to MBD'
          >
            <MBDSVG
              width={30}
              height={30}
              name='MBD'
              aria-description='MBD Icon'
              aria-label='MBD Icon'
            />
          </Link>
        </Button>
      </li>
    </ul>
  )
}
