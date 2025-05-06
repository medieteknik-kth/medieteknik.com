'use client'

import { CategoryOverviewByCommittee } from '@/app/[language]/upload/components/categories'
import FileOverview from '@/app/[language]/upload/components/files'
import FinishedUpload from '@/app/[language]/upload/components/finishedUpload'
import { InvoiceMetadata } from '@/app/[language]/upload/invoice/components/invoice-metadata'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { useFiles, useInvoice } from '@/providers/FormProvider'
import { invoiceSchema } from '@/schemas/invoice'
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

export default function FinalizeInvoice({ language, onBack }: Props) {
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const invoiceForm = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
  })
  const { invoiceData } = useInvoice()
  const { removeAllFiles } = useFiles()
  const { t } = useTranslation(language, 'upload/finalize/invoice')

  const totalAmount = invoiceData.categories.reduce((acc, category) => {
    const amount = Number.parseFloat(category.amount.replace(/,/g, '.'))
    return acc + (Number.isNaN(amount) ? 0 : amount)
  }, 0)

  const postInvoice = async (data: z.infer<typeof invoiceSchema>) => {
    const formData = new FormData()

    for (const file of data.files) {
      formData.append('files', file)
    }

    formData.append('title', invoiceData.title)
    formData.append('description', data.description)
    formData.append('date_issued', data.date.toISOString())
    formData.append('due_date', data.dueDate.toISOString())
    formData.append('is_original', data.isOriginal?.toString() || 'false')
    formData.append('is_booked', data.isBooked?.toString() || 'false')
    formData.append('already_paid', data.hasChapterPaid?.toString() || 'false')
    formData.append('categories', JSON.stringify(data.categories))

    try {
      const response = await fetch('/api/rgbank/invoices', {
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
        invoiceForm.reset()
        invoiceData.categories = []
        invoiceData.files = []
        removeAllFiles()
        invoiceData.description = ''
        invoiceData.invoiceDate = new Date()
        invoiceData.invoiceDueDate = new Date()
        invoiceData.isOriginalInvoice = false
        invoiceData.isInvoiceBooked = false
        invoiceData.paidStatus = undefined
        router.replace(`/${language}`)
      }, 2500)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    invoiceForm.setValue(
      'hasChapterPaid',
      invoiceData.paidStatus === 'yes_chapter' || false
    )
    invoiceForm.setValue('title', invoiceData.title)
    invoiceForm.setValue('files', invoiceData.files)
    invoiceForm.setValue('description', invoiceData.description)
    invoiceForm.setValue('isOriginal', invoiceData.isOriginalInvoice)
    invoiceForm.setValue('isBooked', invoiceData.isInvoiceBooked)
    invoiceForm.setValue('date', invoiceData.invoiceDate)
    invoiceForm.setValue('dueDate', invoiceData.invoiceDueDate)
    invoiceForm.setValue('categories', invoiceData.categories)
  }, [
    invoiceData.title,
    invoiceData.paidStatus,
    invoiceData.files,
    invoiceData.description,
    invoiceData.isOriginalInvoice,
    invoiceData.isInvoiceBooked,
    invoiceData.invoiceDate,
    invoiceData.invoiceDueDate,
    invoiceData.categories,
    invoiceForm,
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
        <FileOverview language={language} files={invoiceData.files} />

        <InvoiceMetadata
          language={language}
          invoiceData={invoiceData}
          totalAmount={totalAmount}
        />

        <CategoryOverviewByCommittee
          language={language}
          categories={invoiceData.categories}
        />

        {invoiceForm.formState.errors && (
          <div className='text-red-500 text-sm'>
            {Object.values(invoiceForm.formState.errors).map((error) => (
              <p key={error.message}>{error.message}</p>
            ))}
          </div>
        )}

        <Button
          title={t('submit')}
          className='w-full h-16 mt-8'
          onClick={() => {
            console.log(invoiceForm.getValues())
            invoiceForm.handleSubmit((data) => {
              postInvoice(data)
            })()
          }}
        >
          {t('submit')}
        </Button>
      </div>
    </>
  )
}
