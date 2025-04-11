'use client'

import { Button } from '@/components/ui/button'
import type { ExpenseResponse } from '@/models/Expense'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import { ArrowDownTrayIcon, DocumentIcon } from '@heroicons/react/24/outline'

interface Props {
  language: LanguageCode
  invoice?: InvoiceResponse
  expense?: ExpenseResponse
}

export default function FilesSection({ language, expense, invoice }: Props) {
  if (!invoice && !expense) {
    return null
  }

  if (invoice && expense) {
    return null
  }

  const item = invoice ?? expense

  if (!item) {
    return null
  }

  const id = invoice ? invoice.invoice_id : expense?.expense_id

  if (!id) {
    return null
  }

  return (
    <div className='flex flex-col gap-4 mt-2'>
      {item.file_urls.map((file) => (
        <div
          key={file.split(id)[1].split('?')[0].substring(1)}
          className='h-52 border border-dashed rounded-md flex flex-col items-center justify-center gap-2'
        >
          <DocumentIcon className='h-8 w-8 text-muted-foreground' />
          <div className='flex flex-col items-center'>
            <h3 className='text-lg font-semibold'>
              {file.split(id)[1].split('?')[0].substring(1)}
            </h3>
          </div>
          <div className='flex gap-2'>
            <Button className='flex items-center gap-2' asChild>
              <a href={file} target='_blank' rel='noopener noreferrer'>
                <ArrowDownTrayIcon className='h-4 w-4' />
                Download
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
