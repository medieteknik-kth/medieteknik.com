'use client'

import BackButton from '@/app/[language]/expense/[expenseId]/back'
import InvoiceProcessingInformation from '@/app/[language]/invoice/[invoiceId]/processingInformation'
import InvoiceStudentInformation from '@/app/[language]/invoice/[invoiceId]/userInfo'
import { fontJetBrainsMono } from '@/app/fonts'
import { AnimatedTabsContent } from '@/components/animation/animated-tabs'
import { PopIn } from '@/components/animation/pop-in'
import AdminSection from '@/components/details/admin'
import CommentsSection from '@/components/details/comments'
import DetailsSection from '@/components/details/details'
import FilesSection from '@/components/details/files'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LanguageCode } from '@/models/Language'
import { usePermissions, useStudent } from '@/providers/AuthenticationProvider'
import { useGeneralDetail, useInvoiceDetail } from '@/providers/DetailProvider'
import { canChangeExpense } from '@/utility/expense/admin'
import { useState } from 'react'

interface Props {
  language: LanguageCode
}

export default function InvoiceDetails({ language }: Props) {
  const { invoice, updateStatus } = useInvoiceDetail()
  const { student: studentAuthor } = useGeneralDetail()
  const { committees } = useStudent()
  const { rgbank_permissions: permissions } = usePermissions()
  const [currentTab, setCurrentTab] = useState('details')

  return (
    <div className='mx-auto max-w-4xl flex flex-col gap-4 py-10'>
      <section className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <BackButton />
          <div>
            <h1
              className={`${fontJetBrainsMono.className} font-mono text-xl max-w-96 truncate`}
              title={invoice.title}
            >
              {invoice.title}
            </h1>
            <p className='text-muted-foreground'>
              Invoice submitted by{' '}
              <span className='font-semibold'>
                {studentAuthor.first_name} {studentAuthor.last_name}
              </span>
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
              <Tabs
                value={currentTab}
                onValueChange={setCurrentTab}
                defaultValue='details'
                className='w-full'
              >
                <TabsList>
                  <TabsTrigger value='details'>Details</TabsTrigger>
                  <TabsTrigger value='files'>Files</TabsTrigger>
                  <TabsTrigger value='comments'>Comments</TabsTrigger>
                  {canChangeExpense(
                    committees,
                    invoice.committee,
                    permissions
                  ) && <TabsTrigger value='admin'>Admin</TabsTrigger>}
                </TabsList>
                <AnimatedTabsContent
                  activeValue={currentTab}
                  animationStyle='slide'
                  value='details'
                >
                  <DetailsSection language={language} invoice={invoice} />
                </AnimatedTabsContent>
                <AnimatedTabsContent
                  activeValue={currentTab}
                  animationStyle='slide'
                  value='files'
                >
                  <FilesSection language={language} invoice={invoice} />
                </AnimatedTabsContent>
                <AnimatedTabsContent
                  activeValue={currentTab}
                  animationStyle='slide'
                  value='comments'
                >
                  <CommentsSection language={language} invoice={invoice} />
                </AnimatedTabsContent>
                <AnimatedTabsContent
                  activeValue={currentTab}
                  animationStyle='slide'
                  value='admin'
                >
                  <AdminSection
                    language={language}
                    invoice={invoice}
                    updateStatus={updateStatus}
                  />
                </AnimatedTabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </PopIn>
        <div className='flex flex-col gap-4'>
          <InvoiceProcessingInformation langauge={language} />
          <InvoiceStudentInformation language={language} />
        </div>
      </section>
    </div>
  )
}
