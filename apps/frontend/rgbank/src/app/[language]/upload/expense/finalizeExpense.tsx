'use client'

import { CategoryOverviewByCommittee } from '@/app/[language]/upload/components/categories'
import FileOverview from '@/app/[language]/upload/components/files'
import FinishedUpload from '@/app/[language]/upload/components/finishedUpload'
import { ExpenseMetadata } from '@/app/[language]/upload/expense/components/expense-metadata'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { useExpense, useFiles } from '@/providers/FormProvider'
import { expenseSchema } from '@/schemas/expense'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

interface Props {
  language: LanguageCode
  onBack: () => void
}

export default function FinalizeExpense({ language, onBack }: Props) {
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const expenseForm = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
  })
  const { expenseData } = useExpense()
  const { removeAllFiles } = useFiles()
  const { t } = useTranslation(language, 'upload/finalize/expense')

  const totalAmount = expenseData.categories.reduce((acc, category) => {
    const amount = Number.parseFloat(category.amount.replace(/,/g, '.'))
    return acc + (Number.isNaN(amount) ? 0 : amount)
  }, 0)

  const postExpense = async (data: z.infer<typeof expenseSchema>) => {
    const formData = new FormData()

    for (const file of data.files) {
      formData.append('files', file)
    }

    formData.append('title', expenseData.title)
    formData.append('description', data.description)
    formData.append('date', data.date.toISOString())
    formData.append('isDigital', data.digital.toString())
    formData.append('categories', JSON.stringify(data.categories))

    try {
      const response = await fetch('/api/rgbank/expenses', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(t('error'))
      }

      setSuccess(true)
      window.scrollTo(0, 0)

      setTimeout(() => {
        expenseForm.reset()
        expenseData.categories = []
        expenseData.files = []
        removeAllFiles()
        expenseData.description = ''
        expenseData.date = new Date()
        expenseData.isDigital = false
        router.replace(`/${language}`)
      }, 2500)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    expenseForm.setValue('title', expenseData.title)
    expenseForm.setValue('files', expenseData.files)
    expenseForm.setValue('date', expenseData.date)
    expenseForm.setValue('description', expenseData.description)
    expenseForm.setValue('digital', expenseData.isDigital)
    expenseForm.setValue('categories', expenseData.categories)
  }, [
    expenseData.title,
    expenseData.categories,
    expenseData.date,
    expenseData.description,
    expenseData.files,
    expenseData.isDigital,
    expenseForm,
  ])

  return success ? (
    <div className='grid place-items-center h-[40.5rem]'>
      <FinishedUpload language={language} />
    </div>
  ) : (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold'>{t('title')}</h1>
          <p className='text-muted-foreground'>{t('description')}</p>
        </div>
        <button
          type='button'
          className='inline-flex items-center gap-2 text-sm font-medium bg-primary/10 hover:bg-primary/20 text-black px-3 py-2 rounded-md transition-colors cursor-pointer dark:text-white'
          onClick={() => {
            onBack()
          }}
        >
          <ChevronLeftIcon className='w-4 h-4' />
          {t('back')}
        </button>
      </div>

      <div className='flex flex-col mt-8 gap-8'>
        <FileOverview language={language} files={expenseData.files} />

        <ExpenseMetadata
          language={language}
          expenseData={expenseData}
          totalAmount={totalAmount}
        />

        <CategoryOverviewByCommittee
          language={language}
          categories={expenseData.categories}
        />
      </div>

      <Button
        className='w-full h-16 mt-8'
        onClick={() => {
          expenseForm.handleSubmit((data) => {
            postExpense(data)
          })()
        }}
      >
        {t('submit')}
      </Button>
    </>
  )
}
