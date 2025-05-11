'use client'

import { useTranslation } from '@/app/i18n/client'
import { PopIn } from '@/components/animation/pop-in'
import { Button } from '@/components/ui/button'
import {
  ArrowRightIcon,
  CheckIcon,
  CreditCardIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { useState } from 'react'

interface Props {
  language: LanguageCode
  onClickCallback: (template: string) => void
}

export default function SelectTemplate({ language, onClickCallback }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const { t } = useTranslation(language, 'upload/base')
  const { t: expenseT } = useTranslation(language, 'expense')
  const { t: invoiceT } = useTranslation(language, 'invoice')

  return (
    <>
      <div>
        <p className='text-center text-sm text-muted-foreground'>
          {t('select_template.description')}
        </p>
        <h1 className='text-3xl font-bold text-center'>
          {t('select_template.title')}
        </h1>
      </div>
      <div className='pb-20'>
        <ul className='w-full h-fit md:h-96 grid md:grid-cols-2 py-10 md:px-10 gap-8'>
          <li className='h-full place-self-center md:place-self-end'>
            <PopIn className='h-48 md:h-full'>
              <button
                className='w-full h-full aspect-square border rounded-xl flex flex-col justify-center items-center gap-10 px-4 py-6 relative bg-white cursor-pointer dark:bg-muted'
                type='button'
                onClick={() => setSelectedTemplate('expense')}
                disabled={selectedTemplate === 'expense'}
              >
                <div className='w-8 h-8 border absolute right-4 top-6 rounded-full'>
                  <CheckIcon
                    className={`w-8 h-8 bg-yellow-400 rounded-full p-1.5 ${
                      selectedTemplate === 'expense'
                        ? 'opacity-100'
                        : 'opacity-0'
                    } transition-all duration-300`}
                  />
                </div>
                <CreditCardIcon className='w-10 h-10 md:w-20 md:h-20' />
                <p className='font-bold text-xl'>{expenseT('expense')}</p>
              </button>
            </PopIn>
          </li>
          <li className='h-full place-self-center md:place-self-start'>
            <PopIn className='h-48 md:h-full'>
              <button
                type='button'
                className='w-full h-full  aspect-square border rounded-xl flex flex-col justify-center items-center gap-10 px-4 py-6 relative bg-white cursor-pointer dark:bg-muted'
                onClick={() => setSelectedTemplate('invoice')}
                disabled={selectedTemplate === 'invoice'}
              >
                <div className='w-8 h-8 border absolute right-4 top-6 rounded-full'>
                  <CheckIcon
                    className={`w-8 h-8 bg-yellow-400 rounded-full p-1.5 ${
                      selectedTemplate === 'invoice'
                        ? 'opacity-100'
                        : 'opacity-0'
                    } transition-all duration-300`}
                  />
                </div>
                <DocumentTextIcon className='w-10 h-10 md:w-20 md:h-20' />
                <p className='font-bold text-xl'>{invoiceT('invoice')}</p>
              </button>
            </PopIn>
          </li>
        </ul>
        <Button
          className='w-full h-16'
          onClick={() => {
            if (onClickCallback) {
              onClickCallback(selectedTemplate)
            }
          }}
          disabled={selectedTemplate === ''}
        >
          {t('select_template.button')}
          <ArrowRightIcon className='w-4 h-4 ml-2' />
        </Button>
      </div>
    </>
  )
}
