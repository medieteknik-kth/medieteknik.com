'use client'

import InvoiceDetails from '@/app/[language]/invoice/[invoiceId]/invoiceDetails'
import { useTranslation } from '@/app/i18n/client'
import HeaderGap from '@/components/header/components/HeaderGap'
import DetailProvider from '@/context/DetailContext'
import type { InvoiceResponseDetailed } from '@/models/Invoice'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'
import useSWR from 'swr'

interface Params {
  language: LanguageCode
  invoiceId: string
}

interface Props {
  params: Promise<Params>
}

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json())

export default function InvoicePage(props: Props) {
  const { isLoading, isAuthenticated } = useAuthentication()
  const router = useRouter()
  const { language, invoiceId } = use(props.params)
  const { data, error } = useSWR<InvoiceResponseDetailed>(
    `/api/rgbank/invoices/${invoiceId}`,
    fetcher
  )
  const { t } = useTranslation(language, 'processing')
  const { t: invoiceT } = useTranslation(language, 'invoice')

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push(`/${language}`)
    }
  }, [isLoading, isAuthenticated, language, router])

  if (error) {
    return (
      <div className='container min-h-screen flex flex-col items-center justify-center gap-4'>
        <h1 className='text-3xl font-bold'>
          {t('error.title', {
            type: invoiceT('invoice').toLowerCase(),
          })}
        </h1>
        <p className='text-muted-foreground'>
          {t('error.description', {
            type: invoiceT('invoice').toLowerCase(),
          })}
        </p>
      </div>
    )
  }
  if (!data) {
    return (
      <div className='container min-h-screen flex flex-col items-center justify-center gap-4'>
        <h1 className='text-3xl font-bold'>
          {t('loading.title', {
            type: invoiceT('invoice').toLowerCase(),
          })}
        </h1>
        <p className='text-muted-foreground'>
          {t('loading.description', {
            type: invoiceT('invoice').toLowerCase(),
          })}
        </p>
      </div>
    )
  }

  const invoice = data.invoice
  const student = data.student
  const bankAccount = data.bank_information
  const thread = data.thread || {
    thread_id: crypto.randomUUID(),
    messages: [],
    unread_messages: [],
  }

  return (
    <main>
      <HeaderGap />
      <div className='md:container px-4 md:px-0'>
        <DetailProvider
          defaultValues={{
            invoice,
            student,
            thread,
            bankAccount,
          }}
        >
          <InvoiceDetails language={language} />
        </DetailProvider>
      </div>
    </main>
  )
}
