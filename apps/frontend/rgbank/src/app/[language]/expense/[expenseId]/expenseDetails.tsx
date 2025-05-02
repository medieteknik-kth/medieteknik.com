'use client'

import ExpenseProcessingInformation from '@/app/[language]/expense/[expenseId]/processingInformation'
import ExpenseStudentInformation from '@/app/[language]/expense/[expenseId]/userInfo'
import { fontJetBrainsMono } from '@/app/fonts'
import { useTranslation } from '@/app/i18n/client'
import { AnimatedTabsContent } from '@/components/animation/animated-tabs'
import { PopIn } from '@/components/animation/pop-in'
import AdminSection from '@/components/details/admin/admin'
import CommentsSection from '@/components/details/comments'
import DetailsSection from '@/components/details/details'
import FilesSection from '@/components/details/files'
import { Button } from '@/components/ui/button'
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
import { useExpenseDetail, useGeneralDetail } from '@/providers/DetailProvider'
import { canChangeExpense } from '@/utility/expense/admin'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface Props {
  language: LanguageCode
}

export default function ExpenseDetails({ language }: Props) {
  const { expense, updateStatus } = useExpenseDetail()
  const { student } = useGeneralDetail()
  const { committees } = useStudent()
  const { rgbank_permissions: permissions } = usePermissions()
  const [currentTab, setCurrentTab] = useState('details')
  const { t } = useTranslation(language, 'processing')
  const { t: expenseT } = useTranslation(language, 'expense')

  return (
    <div className='mx-auto max-w-4xl flex flex-col gap-4 py-10'>
      <section className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            className='flex items-center gap-2 text-sm text-muted-foreground hover:bg-transparent'
            aria-label='Back'
            onClick={() => {
              window.history.back()
            }}
          >
            <ChevronLeftIcon className='h-4 w-4' />
            {t('back')}
          </Button>
          <div>
            <h1
              className={`${fontJetBrainsMono.className} font-mono text-xl max-w-96 truncate`}
              title={expense.title}
            >
              {expense.title}
            </h1>
            <p className='text-muted-foreground'>
              {t('description', {
                type: expenseT('expense'),
              })}
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
                <CardTitle>
                  {t('details.title', {
                    type: expenseT('expense'),
                  })}
                </CardTitle>
                <ExpenseStatusBadge
                  language={language}
                  status={expense.status}
                />
              </div>
              <CardDescription>
                {t('details.description', {
                  type: expenseT('expense'),
                })}
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
                  <TabsTrigger value='details'>{t('tab.details')}</TabsTrigger>
                  <TabsTrigger value='files'>{t('tab.files')}</TabsTrigger>
                  <TabsTrigger value='comments'>
                    {t('tab.comments')}
                  </TabsTrigger>
                  {canChangeExpense(
                    committees,
                    expense.committee,
                    permissions
                  ) && (
                    <TabsTrigger value='admin'>{t('tab.admin')}</TabsTrigger>
                  )}
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
          <ExpenseProcessingInformation language={language} />
          <ExpenseStudentInformation language={language} />
        </div>
      </section>
    </div>
  )
}
