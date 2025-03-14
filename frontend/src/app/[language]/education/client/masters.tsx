'use client'

import type { Master } from '@/app/[language]/education/types/educationTypes'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { LanguageCode } from '@/models/Language'
import { Link } from 'next-view-transitions'
import type { JSX } from 'react'
import './masters.css'

interface Props {
  language: LanguageCode
}

/**
 * @name Masters
 * @description The master programs page, contains the list of master programs and their respective information
 *
 * @param {Props} props - The properties of the component
 * @param {LanguageCode} props.language - The language of the page
 * @returns {JSX.Element} The master programs page
 */
export default function Masters({ language }: Props): JSX.Element {
  const { t } = useTranslation(language, 'education')

  const masters: Master[] = t('masters', { returnObjects: true }) as Master[]

  return (
    <section className='flex flex-col gap-4 sm:px-4 md:px-8 mx-auto container'>
      <h2 className='font-semibold text-2xl sm:text-4xl w-full'>
        {t('master_programs')}
      </h2>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        {masters.map((master) => (
          <Card key={master.title} className='flex flex-col justify-between'>
            <div>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  {master.title}
                  {master.isNew && (
                    <span className='bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                      {t('new')}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{master.description}</CardDescription>
              </CardContent>
            </div>
            <CardFooter className='flex flex-col gap-1 items-start'>
              <div className='mt-2 flex flex-wrap gap-2'>
                {master.tags.map((tag) => (
                  <span
                    key={tag}
                    className='bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 select-none hover:bg-blue-200 dark:hover:bg-blue-300'
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {master.avaliableUntil && (
                <p className='mt-2 text-sm text-yellow-600'>
                  {t('available_until').replace(
                    '{{year}}',
                    master.avaliableUntil.toString()
                  )}
                </p>
              )}
              <Link href={master.kth_link} target='_blank'>
                <Button className='mt-4'>{t('read_more')}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
