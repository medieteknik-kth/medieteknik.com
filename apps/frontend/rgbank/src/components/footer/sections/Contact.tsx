import type { LanguageCode } from '@/models/Language'
import { ArrowTopRightOnSquareIcon, BuildingOffice2Icon, EnvelopeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Props {
  language: LanguageCode
}

export default function ContactSection({ language }: Props) {
  return (
    <li className='w-full h-fit xl:w-1/4 border-t-2 mb-4 lg:mb-8 xl:mb-0 border-green-400 pt-4 px-0 xxs:pl-4 grid xs:flex flex-col place-items-center items-start gap-2'>
      <h4 className='w-fit h-fit'>
        <Link
          href={`/${language}/contact`}
          className='text-2xl text-center xxs:text-left tracking-wider font-bold text-blue-600 dark:text-primary flex items-center hover:underline'
          title='Go to Contact Page'
          aria-label='Go to Contact Page'
        >
          Contact
          <ArrowTopRightOnSquareIcon className='w-6 h-6 ml-2 mb-1' />
        </Link>
      </h4>
      <div className='flex items-center'>
        <EnvelopeIcon className='w-6 h-6 mr-2 text-black dark:text-white' />
        <a
          href='mailto:styrelsen@medieteknik.com'
          className='flex items-center text-center mt-1 text-blue-600 dark:text-primary hover:underline'
          title='Email styrelsen@medieteknik.com'
          aria-label='Email styrelsen@medieteknik.com'
        >
          <span>styrelsen@medieteknik.com</span>
        </a>
      </div>
      <div className='flex items-center'>
        <BuildingOffice2Icon className='w-6 h-6 mr-2 text-black dark:text-white' />
        <span>802411-5647</span>
      </div>
    </li>
  )
}
