'use client'

import BackButton from '@/app/[language]/expense/[expenseId]/back'
import ExpenseProcessingInformation from '@/app/[language]/expense/[expenseId]/processingInformation'
import ExpenseStudentInformation from '@/app/[language]/expense/[expenseId]/userInfo'
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
import { useExpenseDetail, useGeneralDetail } from '@/providers/DetailProvider'
import { useState } from 'react'

interface Props {
  language: LanguageCode
}

export default function ExpenseDetails({ language }: Props) {
  const { expense, updateStatus } = useExpenseDetail()
  const { student, bankAccount } = useGeneralDetail()
  const [currentTab, setCurrentTab] = useState('details')

  return (
    <div className='mx-auto max-w-4xl flex flex-col gap-4 py-10'>
      <section className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <BackButton />
          <div>
            <h1 className={`${fontJetBrainsMono.className} font-mono text-xl`}>
              {expense.expense_id}
            </h1>
            <p className='text-muted-foreground'>
              Expense submitted by{' '}
              <span className='font-semibold'>
                {student.first_name} {student.last_name}
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
                <CardTitle>Expense Details</CardTitle>
                <ExpenseStatusBadge status={expense.status} />
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
                  <TabsTrigger value='admin'>Admin</TabsTrigger>
                </TabsList>
                <AnimatedTabsContent
                  activeValue={currentTab}
                  animationStyle='slide'
                  value='details'
                >
                  <DetailsSection language={language} expense={expense} />
                </AnimatedTabsContent>
                <AnimatedTabsContent
                  activeValue={currentTab}
                  animationStyle='slide'
                  value='files'
                >
                  <FilesSection language={language} expense={expense} />
                </AnimatedTabsContent>
                <AnimatedTabsContent
                  activeValue={currentTab}
                  animationStyle='slide'
                  value='comments'
                >
                  <CommentsSection language={language} expense={expense} />
                </AnimatedTabsContent>
                <AnimatedTabsContent
                  activeValue={currentTab}
                  animationStyle='slide'
                  value='admin'
                >
                  <AdminSection
                    language={language}
                    expense={expense}
                    updateStatus={updateStatus}
                  />
                </AnimatedTabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </PopIn>
        <div className='flex flex-col gap-4'>
          <ExpenseProcessingInformation langauge={language} />
          <ExpenseStudentInformation language={language} />
        </div>
      </section>
    </div>
  )
}
