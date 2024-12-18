'use client'

import { useTranslation } from '@/app/i18n/client'
import { LanguageCode } from '@/models/Language'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface Props {
  language: LanguageCode
}

export default function Loading({ language }: Props) {
  const { t } = useTranslation(language, 'common')
  return (
    <div className='w-full min-h-full h-screen flex items-center justify-center my-2'>
      <ArrowPathIcon className='w-8 h-8 animate-spin text-black dark:text-white mr-4' />
      <p className=''>{t('loading')}</p>
    </div>
  )
}
