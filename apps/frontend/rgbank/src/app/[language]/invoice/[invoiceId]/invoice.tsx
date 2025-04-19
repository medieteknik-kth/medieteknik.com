'use client'

import InvoiceDetails from '@/app/[language]/invoice/[invoiceId]/invoiceDetails'
import DetailProvider from '@/components/context/DetailContext'
import HeaderGap from '@/components/header/components/HeaderGap'
import type { InvoiceResponseDetailed } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import { use } from 'react'
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
  const { language, invoiceId } = use(props.params)
  const { data, error } = useSWR<InvoiceResponseDetailed>(
    `/api/rgbank/invoices/${invoiceId}`,
    fetcher
  )

  if (error) {
    return (
      <div className='container min-h-screen flex flex-col items-center justify-center gap-4'>
        <h1 className='text-3xl font-bold'>Error loading invoice</h1>
        <p className='text-muted-foreground'>
          An error occurred while loading the invoice. Please try again later.
        </p>
      </div>
    )
  }
  if (!data) {
    return (
      <div className='container min-h-screen flex flex-col items-center justify-center gap-4'>
        <h1 className='text-3xl font-bold'>Loading invoice...</h1>
        <p className='text-muted-foreground'>
          Please wait while we load the invoice details.
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
      <div className='container '>
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
