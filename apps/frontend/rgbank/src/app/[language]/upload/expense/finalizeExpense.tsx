'use client'

import { expenseSchema } from '@/app/schemas/expense'
import { Button } from '@/components/ui/button'
import FileDisplay from '@/components/ui/file-display'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type Committee from '@/models/Committee'
import { useExpense } from '@/providers/FormProvider'
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CpuChipIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

interface Props {
  committees: Committee[]
  onBack: () => void
}

function getRandomHexColor() {
  const r = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0')
  const g = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0')
  const b = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0')
  return `#${r}${g}${b}`
}

export default function FinalizeExpense({ committees, onBack }: Props) {
  const expenseForm = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
  })

  const allCommittees = [
    ...committees.map((committee) => ({
      value: committee.committee_id,
      label: committee.translations[0].title,
      icon: committee.logo_url,
    })),
  ]

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
      <div className='grid grid-cols-3 items-center'>
        <Button
          className='w-fit flex gap-4'
          variant={'outline'}
          onClick={() => {
            onBack()
          }}
        >
          <ArrowLeftIcon className='w-4 h-4' />
          Back
        </Button>
        <div>
          <p className='text-center text-sm text-muted-foreground'>
            Review your expense details before finalizing.
          </p>
          <h1 className='text-3xl font-bold text-center'>Finalize</h1>
        </div>
      </div>

      <div className='flex flex-col mt-8 gap-8'>
        <h2 className='text-2xl font-bold'>Expense Details</h2>

        <div className='w-full'>
          <h3 className='text-xl font-bold'>
            Files{' '}
            <span className='text-sm text-muted-foreground'>
              ({expenseData.files.length})
            </span>
          </h3>
          <ul className='flex flex-wrap mt-2 gap-2'>
            <FileDisplay files={expenseData.files} preview />
          </ul>
        </div>

        <div>
          <h3 className='text-xl font-bold'>Metadata</h3>

          <div className='flex items-center gap-4 mb-2 p-2'>
            <CreditCardIcon className='w-8 h-8 text-yellow-400' />
            <p>Amount: {totalAmount} SEK</p>
          </div>
          <div className='flex items-center gap-4 mb-2 p-2'>
            <CalendarDaysIcon className='w-8 h-8 text-yellow-400' />
            <p>Date: {expenseData.date?.toLocaleDateString()}</p>
          </div>
          <div className='flex items-center gap-4 mb-2 p-2'>
            <CpuChipIcon className='w-8 h-8 text-yellow-400' />
            <p>Is Digital Receipt: {expenseData.isDigital ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div>
          <h3 className='text-xl font-bold'>Categories</h3>
          {allCommittees.map((committee) => {
            const authorCategories = expenseData.categories.filter(
              (category) => category.author === committee.value
            )
            if (authorCategories.length === 0) return null

            return (
              <div key={committee.value} className='my-4'>
                <div className='flex items-center gap-4 mb-2 p-2'>
                  <div className='bg-white p-1 rounded-lg shadow-sm border'>
                    <Image
                      src={committee.icon}
                      alt='Committee'
                      unoptimized
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold'>{committee.label}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {authorCategories.reduce((acc, category) => {
                        const amount = Number.parseFloat(
                          category.amount.replace(/,/g, '.')
                        )
                        return acc + (Number.isNaN(amount) ? 0 : amount)
                      }, 0)}{' '}
                      SEK
                    </p>
                  </div>
                </div>
                <Table className='w-full'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-52'>Category</TableHead>
                      <TableHead className='w-52'>Type</TableHead>
                      <TableHead className='w-52'>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {authorCategories.map((category, index) => (
                      <TableRow
                        key={`${category.author}-${category.type}-${index}`}
                      >
                        <TableCell>{category.category}</TableCell>
                        <TableCell>{category.type}</TableCell>
                        <TableCell>
                          {category.amount.replace(/,/g, '.')} SEK
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          })}
        </div>
      </div>

      <Button
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
