'use client'

import BackButton from '@/app/[language]/expense/[expenseId]/back'
import Comments from '@/app/[language]/invoice/[invoiceId]/tabs/comments'
import Details from '@/app/[language]/invoice/[invoiceId]/tabs/details'
import Files from '@/app/[language]/invoice/[invoiceId]/tabs/files'
import { fontJetBrainsMono } from '@/app/fonts'
import { PopIn } from '@/components/animation/pop-in'
import HeaderGap from '@/components/header/components/HeaderGap'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { InvoiceResponseWithStudentDetails } from '@/models/Invoice'
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
  const { data, error } = useSWR<InvoiceResponseWithStudentDetails>(
    `/api/rgbank/invoices/${invoiceId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      refreshWhenHidden: false,
    }
  )

  if (error) {
    return (
      <div className='container'>
        <h1 className='text-3xl font-bold'>Error loading invoice</h1>
        <p className='text-muted-foreground'>
          An error occurred while loading the invoice. Please try again later.
        </p>
      </div>
    )
  }
  if (!data) {
    return (
      <div className='container'>
        <h1 className='text-3xl font-bold'>Loading invoice...</h1>
        <p className='text-muted-foreground'>
          Please wait while we load the invoice details.
        </p>
      </div>
    )
  }

  const invoice = data.invoice
  const student = data.student
  const bankInformation = data.bank_information
  const thread = data.thread

  return (
    <main>
      <HeaderGap />
      <div className='container '>
        <div className='mx-auto max-w-4xl flex flex-col gap-4 py-10'>
          <section className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <BackButton />
              <div>
                <h1
                  className={`${fontJetBrainsMono.className} font-mono text-xl`}
                >
                  {invoiceId}
                </h1>
                <p className='text-muted-foreground'>
                  Invoice submitted by {'<'}user{'>'}
                </p>
              </div>
            </div>
          </section>
          <section className='grid grid-cols-3 gap-4'>
            <PopIn className='col-span-2'>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle>Invoice Details</CardTitle>
                    <ExpenseStatusBadge status={invoice.status} />
                  </div>
                  <CardDescription>
                    Complete details of the expense will be shown here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue='details' className='w-full'>
                    <TabsList>
                      <TabsTrigger value='details'>Details</TabsTrigger>
                      <TabsTrigger value='files'>Files</TabsTrigger>
                      <TabsTrigger value='comments'>Comments</TabsTrigger>
                    </TabsList>
                    <TabsContent value='details'>
                      <Details language={language} invoice={invoice} />
                    </TabsContent>
                    <TabsContent value='files'>
                      <Files language={language} invoice={invoice} />
                    </TabsContent>
                    <TabsContent value='comments'>
                      <Comments language={language} invoice={invoice} thread={thread} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </PopIn>
            <div className='flex flex-col gap-4'>
              <PopIn delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Information</CardTitle>
                  </CardHeader>
                  <CardContent className='flex flex-col gap-4'>
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Current Status
                      </h3>
                      <ExpenseStatusBadge
                        status={invoice.status}
                        className='w-full mt-1'
                      />
                    </div>
                    <Separator />
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Submitted On
                      </h3>
                      <p className='mt-1'>
                        {new Date(invoice.created_at).toLocaleDateString(
                          language,
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </PopIn>
              <PopIn delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                  </CardHeader>
                  <CardContent className='flex flex-col gap-4'>
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Name
                      </h3>
                      <p className='mt-1'>
                        {student.first_name} {student.last_name}
                      </p>
                    </div>
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Email
                      </h3>
                      <p className='mt-1'>{student.email}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Bank Name
                      </h3>
                      <p className='mt-1'>{bankInformation.bank_name}</p>
                    </div>
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Sorting Number
                      </h3>
                      <p className='mt-1'>{bankInformation.sorting_number}</p>
                    </div>
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Account Number
                      </h3>
                      <p className='mt-1'>{bankInformation.account_number}</p>
                    </div>
                  </CardContent>
                </Card>
              </PopIn>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
