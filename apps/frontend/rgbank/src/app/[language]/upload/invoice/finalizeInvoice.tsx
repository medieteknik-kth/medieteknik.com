'use client'

import { CategoryOverviewByCommittee } from '@/app/[language]/upload/components/categories'
import FileOverview from '@/app/[language]/upload/components/files'
import FinishedUpload from '@/app/[language]/upload/components/finishedUpload'
import { InvoiceMetadata } from '@/app/[language]/upload/invoice/components/invoice-metadata'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import type { InvoiceData } from '@/models/Invoice'
import { useFiles, useInvoice } from '@/providers/FormProvider'
import { invoiceSchema } from '@/schemas/invoice'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { z } from '@zod/mini'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  language: LanguageCode
  onBack: () => void
}

export default function FinalizeInvoice({ language, onBack }: Props) {
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { invoiceData } = useInvoice()
  const { removeAllFiles } = useFiles()
  const { t } = useTranslation(language, 'upload/finalize/invoice')
  const [form, setForm] = useState<InvoiceData>({
    title: '',
    files: [],
    invoiceDate: new Date(),
    invoiceDueDate: new Date(),
    description: '',
    isInvoiceBooked: false,
    isOriginalInvoice: false,
    paidStatus: 'no_chapter',
    categories: [],
  })
  const [formErrors, setFormErrors] = useState({
    title: '',
    files: '',
    date: '',
    description: '',
    isOriginal: '',
    isBooked: '',
    categories: '',
  })

  const totalAmount = invoiceData.categories.reduce((acc, category) => {
    const amount = Number.parseFloat(category.amount.replace(/,/g, '.'))
    return acc + (Number.isNaN(amount) ? 0 : amount)
  }, 0)

  const postInvoice = async (data: z.infer<typeof invoiceSchema>) => {
    const errors = invoiceSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        title: fieldErrors.properties?.title?.errors[0] || '',
        files: fieldErrors.properties?.files?.errors[0] || '',
        date: fieldErrors.properties?.date?.errors[0] || '',
        description: fieldErrors.properties?.description?.errors[0] || '',
        isOriginal: fieldErrors.properties?.isOriginal?.errors[0] || '',
        isBooked: fieldErrors.properties?.isBooked?.errors[0] || '',
        categories: fieldErrors.properties?.categories?.errors[0] || '',
      })
      return
    }

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
    formData.append(
      'categories',
      JSON.stringify(
        data.categories.map((category) => ({
          ...category,
          amount: category.amount.replace(/,/g, '.'),
        }))
      )
    )

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
        setForm({
          title: '',
          files: [],
          invoiceDate: new Date(),
          invoiceDueDate: new Date(),
          description: '',
          isInvoiceBooked: false,
          isOriginalInvoice: false,
          paidStatus: 'no_chapter',
          categories: [],
        })
        removeAllFiles()
        router.replace(`/${language}`)
      }, 2500)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setForm({
      title: invoiceData.title,
      files: invoiceData.files,
      invoiceDate: invoiceData.invoiceDate,
      invoiceDueDate: invoiceData.invoiceDueDate,
      description: invoiceData.description,
      isInvoiceBooked: invoiceData.isInvoiceBooked,
      isOriginalInvoice: invoiceData.isOriginalInvoice,
      paidStatus: invoiceData.paidStatus,
      categories: invoiceData.categories,
    })
  }, [invoiceData])

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

        {formErrors && (
          <div className='flex flex-col gap-2 mt-4'>
            {formErrors.title && (
              <p className='text-red-500 text-xs'>{formErrors.title}</p>
            )}
            {formErrors.description && (
              <p className='text-red-500 text-xs'>{formErrors.description}</p>
            )}
            {formErrors.date && (
              <p className='text-red-500 text-xs'>{formErrors.date}</p>
            )}
            {formErrors.isOriginal && (
              <p className='text-red-500 text-xs'>{formErrors.isOriginal}</p>
            )}
            {formErrors.isBooked && (
              <p className='text-red-500 text-xs'>{formErrors.isBooked}</p>
            )}
            {formErrors.files && (
              <p className='text-red-500 text-xs'>{formErrors.files}</p>
            )}
            {formErrors.categories && (
              <p className='text-red-500 text-xs'>{formErrors.categories}</p>
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
              date: form.invoiceDate,
              dueDate: form.invoiceDueDate,
              description: form.description,
              isOriginal: form.isOriginalInvoice,
              isBooked: form.isInvoiceBooked,
              hasChapterPaid: form.paidStatus === 'yes_chapter',
            }

            postInvoice(data)
          }}
        >
          {t('submit')}
        </Button>
      </div>
    </>
  )
}
