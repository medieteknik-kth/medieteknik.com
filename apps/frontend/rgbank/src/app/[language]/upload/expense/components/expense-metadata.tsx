'use client'

import { useTranslation } from '@/app/i18n/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import type { ExpenseData } from '@/models/Expense'
import {
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  CreditCardIcon,
  H1Icon,
} from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'

interface Props {
  language: LanguageCode
  expenseData: ExpenseData
  totalAmount: number
}

export function ExpenseMetadata({ language, expenseData, totalAmount }: Props) {
  const { t } = useTranslation(language, 'upload/finalize/expense')

  return (
    <Card className='shadow-md'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-semibold leading-tight'>
          {t('metadata.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Title */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <H1Icon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium'>
              {t('metadata.text.title')}
            </p>
            <p className='mt-1'>{expenseData.title}</p>
          </div>
        </div>

        {/* Description */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <ChatBubbleLeftIcon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium'>
              {t('metadata.text.description')}
            </p>
            <p className='mt-1'>{expenseData.description}</p>
          </div>
        </div>

        <Separator />

        {/* Digital Reciept */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <AdjustmentsHorizontalIcon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium mb-2'>
              {t('metadata.status.title')}
            </p>
            <div className='grid grid-cols-2 gap-y-2'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='original'
                  disabled
                  checked={expenseData.isDigital}
                />
                <label htmlFor='original' className='text-sm'>
                  {t('metadata.status.digital')}
                </label>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Amount */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <CreditCardIcon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium'>
              {t('metadata.amount')}
            </p>
            <p className='mt-1 text-lg font-semibold'>
              {totalAmount.toLocaleString(language, {
                currency: 'SEK',
                style: 'currency',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <Separator />

        {/* Dates */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <CalendarIcon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium mb-2'>
              {t('metadata.dates.title')}
            </p>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>
                  {t('metadata.dates.expense')}
                </p>
                <p className='font-medium'>
                  {expenseData.date.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
