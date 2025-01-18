import { useTranslation } from '@/app/i18n'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

import type { JSX } from 'react'

interface Props {
  language: LanguageCode
}

/**
 * @name Iconography
 * @description The relevant logos for the graphical identity
 *
 * @param {Props} props - The component properties
 * @param {string} props.language - The currently selected language
 * @returns {Promise<JSX.Element>} The relevant logos for the graphical identity
 */
export default async function Iconography({
  language,
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'graphic')

  return (
    <section id='iconography' className='px-2 sm:px-5 md:px-12 mb-8'>
      <h2 className='py-4 font-bold text-3xl uppercase tracking-wide'>
        {t('iconography')}
      </h2>
      <div>
        <h3 className='text-2xl pb-2'>{t('iconography.emblems')}</h3>
        <ul className='flex gap-4 flex-wrap'>
          <li className='flex flex-col gap-2'>
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/logo.webp'
              alt='Base Emblem'
              width={256}
              height={256}
              className='w-32 h-auto aspect-square'
            />
            <Button asChild variant={'outline'}>
              <Link
                href='https://storage.googleapis.com/medieteknik-static/static/logo.webp'
                className='flex items-center gap-1'
                target='_blank'
              >
                <ArrowDownTrayIcon className='w-5 h-5' />
                {t('iconography.download')}
              </Link>
            </Button>
          </li>
        </ul>
      </div>
      <div>
        <h3 className='text-2xl py-2'>{t('iconography.logos')}</h3>
        <ul className='flex gap-4 flex-wrap'>
          <li className='flex flex-col gap-2 max-w-96'>
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/dark_logobig.webp'
              alt='Dark Logo'
              width={752}
              height={386}
              className='w-96 h-auto bg-[#111]'
            />
            <div>
              <p className='tracking-wide'>
                {t('iconography.logos.white_text')}
              </p>
              <p className='text-neutral-600 dark:text-neutral-300'>
                {t('iconography.logos.white_text.description')}
              </p>
            </div>
            <Button asChild variant={'outline'}>
              <Link
                href='https://storage.googleapis.com/medieteknik-static/static/dark_logobig.webp'
                className='flex items-center gap-1'
                target='_blank'
              >
                <ArrowDownTrayIcon className='w-6 h-6' />
                {t('iconography.download')}
              </Link>
            </Button>
          </li>
          <li className='flex flex-col gap-2'>
            <Image
              src='https://storage.googleapis.com/medieteknik-static/static/light_logobig.webp'
              alt='Light Logo'
              width={752}
              height={386}
              className='w-96 h-auto bg-white'
            />
            <div>
              <p className='tracking-wide'>
                {t('iconography.logos.dark_text')}
              </p>
              <p className='text-neutral-600 dark:text-neutral-300'>
                {t('iconography.logos.dark_text.description')}
              </p>
            </div>
            <Button asChild variant={'outline'}>
              <Link
                href='https://storage.googleapis.com/medieteknik-static/static/light_logobig.webp'
                className='flex items-center gap-1'
                target='_blank'
              >
                <ArrowDownTrayIcon className='w-5 h-5' />
                {t('iconography.download')}
              </Link>
            </Button>
          </li>
        </ul>
      </div>
    </section>
  )
}
