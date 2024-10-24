'use client'

import { useTranslation } from '@/app/i18n/client'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function Loading({ language }: { language: string }) {
  const { t } = useTranslation(language, 'common')
  return (
    <div className='w-full min-h-full h-screen flex items-center justify-center my-2'>
      <ArrowPathIcon className='w-8 h-8 animate-spin text-black mr-4' />
      <p className=''>{t('loading')}</p>
    </div>
  )
}
