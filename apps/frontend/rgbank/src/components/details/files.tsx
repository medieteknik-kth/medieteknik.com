'use client'

import { useTranslation } from '@/app/i18n/client'
import { Label } from '@/components/ui'
import { Button } from '@/components/ui/button'
import type { ExpenseResponse } from '@/models/Expense'
import type { InvoiceResponse } from '@/models/Invoice'
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import Image from 'next/image'

interface Props {
  language: LanguageCode
  invoice?: InvoiceResponse
  expense?: ExpenseResponse
}

export default function FilesSection({ language, expense, invoice }: Props) {
  const { t } = useTranslation(language, 'processing')
  if (!invoice && !expense) {
    return null
  }

  if (invoice && expense) {
    return null
  }

  const item = invoice ?? expense

  if (!item) {
    return null
  }

  const id = invoice ? invoice.invoice_id : expense?.expense_id

  if (!id) {
    return null
  }

  const isImage = (url: string) => {
    return (
      url.split('?')[0]?.endsWith('.jpg') ||
      url.split('?')[0]?.endsWith('.jpeg') ||
      url.split('?')[0]?.endsWith('.png') ||
      url.split('?')[0]?.endsWith('.gif') ||
      url.split('?')[0]?.endsWith('.webp')
    )
  }

  return (
    <div className='flex flex-col gap-4 mt-2'>
      {item.file_urls?.map((file, fileIndex) => {
        const fileName = file.split(id)[1].split('?')[0].substring(1)
        const categoryIndex = item.categories?.[fileIndex]?.fileId
        const categoryData =
          categoryIndex !== undefined ? item.categories?.[categoryIndex] : null

        return (
          <div
            key={file.split(id)[1].split('?')[0].substring(1)}
            className='h-52 border border-dashed rounded-md flex gap-2 relative'
          >
            <div className='max-w-1/3 md:max-w-1/2 h-full'>
              {isImage(file) ? (
                <Image
                  src={file}
                  alt={fileName}
                  width={256}
                  height={256}
                  className='w-auto h-full object-cover rounded-l-md'
                />
              ) : (
                <div className='h-24 w-24 flex items-center justify-center'>
                  <DocumentTextIcon className='h-12 w-12 text-red-500' />
                </div>
              )}
            </div>

            <div className='flex grow flex-col py-2 justify-between'>
              <div className='flex flex-col'>
                <Label className='font-semibold'>{t('files.fileName')}</Label>
                <h3
                  className='text-lg font-semibold truncate max-w-3xs'
                  title={fileName}
                >
                  {fileName}
                </h3>
              </div>

              {item.categories?.[fileIndex] && categoryData && (
                <div className='text-xs flex flex-col gap-2'>
                  <div>
                    <Label className='font-semibold'>
                      {t('details.categories.domain')}
                    </Label>
                    <p>
                      {item.committee
                        ? item.committee?.translations[0].title
                        : categoryData.author}
                    </p>
                  </div>

                  <div>
                    <Label className='font-semibold'>
                      {t('details.categories.category')}
                    </Label>
                    <p>{categoryData.category}</p>
                  </div>

                  <div>
                    <Label className='font-semibold'>
                      {t('details.categories.amount')}
                    </Label>
                    <p>
                      SEK{' '}
                      {Number.parseFloat(categoryData.amount).toLocaleString(
                        language,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className='absolute bottom-2 right-2'>
              <Button className='flex gap-2' asChild>
                <a href={file} target='_blank' rel='noopener noreferrer'>
                  <ArrowDownTrayIcon className='h-4 w-4' />
                  <p className='hidden md:inline'>{t('files.download')}</p>
                </a>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
