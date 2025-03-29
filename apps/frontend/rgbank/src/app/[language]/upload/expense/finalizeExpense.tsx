'use client'

import { CategoryOverviewByCommittee } from '@/app/[language]/upload/components/categories'
import FileOverview from '@/app/[language]/upload/components/files'
import { ExpenseMetadata } from '@/app/[language]/upload/expense/components/expense-metadata'
import { expenseSchema } from '@/app/schemas/expense'
import { Button } from '@/components/ui/button'
import type Committee from '@/models/Committee'
import { useExpense } from '@/providers/FormProvider'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

interface Props {
  committees: Committee[]
  onBack: () => void
}

export default function FinalizeExpense({ committees, onBack }: Props) {
  const expenseForm = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
  })

  const { expenseData } = useExpense()

  const totalAmount = expenseData.categories.reduce((acc, category) => {
    const amount = Number.parseFloat(category.amount.replace(/,/g, '.'))
    return acc + (Number.isNaN(amount) ? 0 : amount)
  }, 0)

  const postExpense = async (data: z.infer<typeof expenseSchema>) => {
    const formData = new FormData()
    formData.append('files', JSON.stringify(data.files))
    formData.append('date', data.date.toString())
    formData.append('isDigital', data.digital.toString())
    formData.append('categories', JSON.stringify(data.categories))

    try {
      const response = await fetch('/api/expense', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload expense')
      }

      const result = await response.json()
      console.log('Expense uploaded successfully:', result)
      // TODO: Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }

  useEffect(() => {
    expenseForm.setValue('files', expenseData.files)
    expenseForm.setValue('date', expenseData.date)
    expenseForm.setValue('digital', expenseData.isDigital)
    expenseForm.setValue('categories', expenseData.categories)
  }, [
    expenseData.categories,
    expenseData.date,
    expenseData.files,
    expenseData.isDigital,
    expenseForm,
  ])

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <p className='text-2xl font-bold'>Finalize</p>
          <h1 className='text-muted-foreground'>
            {' '}
            Review your expense details before finalizing.
          </h1>
        </div>
        <button
          type='button'
          className='inline-flex items-center gap-2 text-sm font-medium bg-primary/10 hover:bg-primary/20 text-black px-3 py-2 rounded-md transition-colors cursor-pointer dark:text-white'
          onClick={() => {
            onBack()
          }}
        >
          <ChevronLeftIcon className='w-4 h-4' />
          Back
        </button>
      </div>

      <div className='flex flex-col mt-8 gap-8'>
        <FileOverview files={expenseData.files} />

        <ExpenseMetadata expenseData={expenseData} totalAmount={totalAmount} />

        <CategoryOverviewByCommittee
          committees={committees}
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
        Submit Expense
      </Button>
    </>
  )
}
