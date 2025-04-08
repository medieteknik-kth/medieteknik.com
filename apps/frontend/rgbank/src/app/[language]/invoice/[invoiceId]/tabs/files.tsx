import { Button } from '@/components/ui/button'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import { ArrowDownTrayIcon, DocumentIcon } from '@heroicons/react/24/outline'

interface Props {
  language: LanguageCode
  invoice: InvoiceResponse
}

export default function Files({ language, invoice }: Props) {
  return (
    <div className='flex flex-col gap-4'>
      {invoice.file_urls.map((file, index) => (
        <div
          key={file.split(invoice.invoice_id)[1].split('?')[0].substring(1)}
          className='h-52 border border-dashed rounded-md flex flex-col items-center justify-center gap-2'
        >
          <DocumentIcon className='h-8 w-8 text-muted-foreground' />
          <div className='flex flex-col items-center'>
            <h3 className='text-lg font-semibold'>
              {file.split(invoice.invoice_id)[1].split('?')[0].substring(1)}
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
