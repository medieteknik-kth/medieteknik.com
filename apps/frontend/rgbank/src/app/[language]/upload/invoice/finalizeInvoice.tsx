'use client'

import { CategoryOverviewByCommittee } from '@/app/[language]/upload/components/categories'
import FileOverview from '@/app/[language]/upload/components/files'
import { InvoiceMetadata } from '@/app/[language]/upload/invoice/components/invoice-metadata'
import { Button } from '@/components/ui/button'
import type Committee from '@/models/Committee'
import { useInvoice } from '@/providers/FormProvider'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

interface Props {
  committees: Committee[]
  onBack: () => void
}

export default function FinalizeInvoice({ committees, onBack }: Props) {
  const { invoiceData } = useInvoice()

  const totalAmount = invoiceData.categories.reduce((acc, category) => {
    const amount = Number.parseFloat(category.amount.replace(/,/g, '.'))
    return acc + (Number.isNaN(amount) ? 0 : amount)
  }, 0)

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold'>Finalize</h1>
          <p className='text-muted-foreground'>
            Review your invoice details before finalizing.
          </p>
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
        <FileOverview files={invoiceData.files} />

        <InvoiceMetadata invoiceData={invoiceData} totalAmount={totalAmount} />

        <CategoryOverviewByCommittee
          categories={invoiceData.categories}
          committees={committees}
        />

        <Button>Submit Invoice</Button>
      </div>
    </>
  )
}
