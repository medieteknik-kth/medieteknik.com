'use client'

import { useTranslation } from '@/app/i18n/client'
import { PopIn } from '@/components/animation/pop-in'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import { Separator } from '@/components/ui/separator'
import { useInvoiceDetail } from '@/providers/DetailProvider'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'

interface Props {
  language: LanguageCode
}

export default function InvoiceProcessingInformation({ language }: Props) {
  const { invoice } = useInvoiceDetail()
  const { t } = useTranslation(language, 'processing')

  return (
    <PopIn delay={0.1}>
      <Card>
        <CardHeader>
          <CardTitle>{t('processing.title')}</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div>
            <h3 className='text-sm font-medium text-muted-foreground'>
              {t('processing.status')}
            </h3>
            <ExpenseStatusBadge
              language={language}
              status={invoice.status}
              className='w-full mt-1'
            />
          </div>
          <Separator />
          <div>
            <h3 className='text-sm font-medium text-muted-foreground'>
              {t('processing.submitted')}
            </h3>
            <p className='mt-1'>
              {new Date(invoice.created_at).toLocaleDateString(language, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </PopIn>
  )
}
