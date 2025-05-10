'use client'

import { CategoryOverviewByCommittee } from '@/app/[language]/upload/components/categories'
import FileOverview from '@/app/[language]/upload/components/files'
import FinishedUpload from '@/app/[language]/upload/components/finishedUpload'
import { ExpenseMetadata } from '@/app/[language]/upload/expense/components/expense-metadata'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import type { ExpenseData } from '@/models/Expense'
import { useExpense, useFiles } from '@/providers/FormProvider'
import { expenseSchema } from '@/schemas/expense'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { z } from 'zod'

interface Props {
  language: LanguageCode
  onBack: () => void
}

export default function FinalizeExpense({ language, onBack }: Props) {
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { expenseData } = useExpense()
  const { removeAllFiles } = useFiles()
  const { t } = useTranslation(language, 'upload/finalize/expense')
  const [form, setForm] = useState<ExpenseData>({
    title: '',
    files: [],
    date: new Date(),
    description: '',
    isDigital: false,
    categories: [],
  })
  const [formErrors, setFormErrors] = useState({
    title: '',
    files: '',
    date: '',
    description: '',
    isDigital: '',
    categories: '',
  })

  const totalAmount = expenseData.categories.reduce((acc, category) => {
    const amount = Number.parseFloat(category.amount.replace(/,/g, '.'))
    return acc + (Number.isNaN(amount) ? 0 : amount)
  }, 0)

  const postExpense = async (data: z.infer<typeof expenseSchema>) => {
    const errors = expenseSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        title: fieldErrors.properties?.title?.errors[0] || '',
        files: fieldErrors.properties?.files?.errors[0] || '',
        date: fieldErrors.properties?.date?.errors[0] || '',
        description: fieldErrors.properties?.description?.errors[0] || '',
        isDigital: fieldErrors.properties?.digital?.errors[0] || '',
        categories: fieldErrors.properties?.categories?.errors[0] || '',
      })
      return
    }

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
    setForm({
      title: expenseData.title,
      files: expenseData.files,
      date: expenseData.date,
      description: expenseData.description,
      isDigital: expenseData.isDigital,
      categories: expenseData.categories,
    })
  }, [expenseData])

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

      {formErrors && (
        <div className='flex flex-col gap-2 mt-4'>
          {formErrors.title && (
            <p className='text-red-500 text-sm'>{formErrors.title}</p>
          )}
          {formErrors.files && (
            <p className='text-red-500 text-sm'>{formErrors.files}</p>
          )}
          {formErrors.date && (
            <p className='text-red-500 text-sm'>{formErrors.date}</p>
          )}
          {formErrors.description && (
            <p className='text-red-500 text-sm'>{formErrors.description}</p>
          )}
          {formErrors.isDigital && (
            <p className='text-red-500 text-sm'>{formErrors.isDigital}</p>
          )}
          {formErrors.categories && (
            <p className='text-red-500 text-sm'>{formErrors.categories}</p>
          )}
        </div>
      )}

      <Button
        title={t('submit')}
        className='w-full h-16 mt-8'
        onClick={() => {
          const data = {
            ...form,
            files: form.files,
            date: form.date,
            title: form.title,
            description: form.description,
            digital: form.isDigital,
            categories: form.categories,
          }

          postExpense(data)
        }}
      >
        {t('submit')}
      </Button>
    </>
  )
}
