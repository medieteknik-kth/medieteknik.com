'use client'

import { useTranslation } from '@/app/i18n/client'
import type { LanguageCode } from '@/models/Language'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface Props {
  language: LanguageCode
}

export default function FinishedUpload({ language }: Props) {
  const { t } = useTranslation(language, 'upload/finalize/complete')
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className='flex flex-col items-center justify-center gap-4 bg-white py-10 w-fit px-24 h-fit'
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.5 }}
        className='flex items-center justify-center w-16 h-16 rounded-full bg-green-100'
      >
        <CheckCircleIcon className='w-16 h-16 text-green-500' />
      </motion.div>
      <h1 className='text-2xl font-bold'>{t('title')}</h1>
      <p className='text-muted-foreground'>{t('description')}</p>
    </motion.div>
  )
}
