import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { TFunction } from 'next-i18next'

/**
 * Guest
 * @description Renders the display for guest or non-authenticated users
 *
 * @param {TFunction} t - The translation function
 * @returns {JSX.Element} The guest display
 */
export default function Guest({ t }: { t: TFunction }): JSX.Element {
  return (
    <Button variant={'ghost'} className='w-full h-full rounded-none lg:mr-2'>
      <Link
        href='/login'
        className='w-full h-full flex justify-center xl:justify-end items-center'
        title={t('login')}
        aria-label={t('login')}
      >
        <p className='text-sm hidden flex-col items-end mr-4 uppercase xl:flex'>
          {t('login')}
        </p>
        <UserCircleIcon className='w-10 h-10' />
      </Link>
    </Button>
  )
}
