'use client'

import { useTranslation } from '@/app/i18n/client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import type { InvoiceData } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import {
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  H1Icon,
} from '@heroicons/react/24/outline'

interface Props {
  language: LanguageCode
  invoiceData: InvoiceData
  totalAmount: number
}

export function InvoiceMetadata({ language, invoiceData, totalAmount }: Props) {
  const { t } = useTranslation(language, 'upload/finalize/invoice')

  return (
    <Card className='shadow-md'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-semibold leading-tight'>
          {t('metadata.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Paid Status */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <Cog6ToothIcon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium'>
              {t('metadata.paidStatus')}
            </p>
            <div className='mt-1'>
              <Badge
                variant={
                  invoiceData.paidStatus === 'no_chapter'
                    ? 'destructive'
                    : 'default'
                }
              >
                {invoiceData.paidStatus === 'no_chapter'
                  ? t('metadata.paidStatus.unpaid')
                  : t('metadata.paidStatus.paid')}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Title */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <H1Icon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium'>
              {t('metadata.text.title')}
            </p>
            <p className='mt-1'>{invoiceData.title}</p>
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
            <p className='mt-1'>{invoiceData.description}</p>
          </div>
        </div>

        <Separator />

        {/* Invoice Status */}
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
                  checked={invoiceData.isOriginalInvoice}
                />
                <label htmlFor='original' className='text-sm'>
                  {t('metadata.status.original')}
                </label>
              </div>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='booked'
                  disabled
                  checked={invoiceData.isInvoiceBooked}
                />
                <label htmlFor='booked' className='text-sm'>
                  {t('metadata.status.booked')}
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
                  {t('metadata.dates.invoice')}
                </p>
                <p className='font-medium'>
                  {invoiceData.invoiceDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>
                  {t('metadata.dates.payment')}
                </p>
                <p className='font-medium'>
                  {invoiceData.invoiceDueDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
