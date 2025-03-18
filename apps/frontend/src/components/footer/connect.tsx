import { Button } from '@/components/ui/button'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import FacebookLogo from 'public/images/logos/Facebook_Logo_Primary.webp'
import InstagramLogo from 'public/images/logos/Instagram_Glyph_Gradient.webp'
import LinkedInLogo from 'public/images/logos/LI-In-Bug.webp'
import MBDSVG from 'public/images/svg/mbd.svg'
import type { JSX } from 'react'

/**
 * @name ConnectSection
 * @description Renders the connect section
 *
 * @returns {Promise<JSX.Element>} The connect section
 */
export default async function ConnectSection(): Promise<JSX.Element> {
  return (
    <ul className='w-full mt-2 *:cursor-pointer flex gap-4'>
      <li className='h-fit w-fit' title='Facebook'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='http://www.facebook.com/medieteknik.kth'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full p-2'
            title='Facebook'
            aria-label="Links to Medieteknik's Facebook page"
          >
            <Image
              src={FacebookLogo}
              width={32}
              height={32}
              alt='Instagram Icon'
              className='h-8 w-auto'
            />
          </Link>
        </Button>
      </li>
      <li title='Instagram'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='https://www.instagram.com/medieteknik_kth/'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full p-2'
            title='Instagram'
            aria-label="Links to Medieteknik's Instagram page"
          >
            <Image
              src={InstagramLogo}
              width={32}
              height={32}
              alt='Instagram Icon'
              className='h-8 w-auto'
            />
          </Link>
        </Button>
      </li>
      <li title='LinkedIn'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='https://www.linkedin.com/company/sektionen-f%C3%B6r-medieteknik-%C2%A0kth/'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full p-2'
            title='LinkedIn'
            aria-label="Links to Medieteknik's LinkedIn page"
          >
            <Image
              src={LinkedInLogo}
              width={38}
              height={32}
              alt='LinkedIn Icon'
            />
          </Link>
        </Button>
      </li>
      <li title='Mediesbransch Dag'>
        <Button asChild size='icon' variant='ghost'>
          <Link
            href='https://mediasbranschdag.com'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full h-full fill-yellow-400 p-2'
            title='MBD'
            aria-label='Links to MBD'
          >
            <MBDSVG
              width={32}
              height={32}
              name='MBD'
              aria-description='MBD Icon'
              aria-label='MBD Icon'
              className='h-8 w-auto'
            />
          </Link>
        </Button>
      </li>
    </ul>
  )
}
