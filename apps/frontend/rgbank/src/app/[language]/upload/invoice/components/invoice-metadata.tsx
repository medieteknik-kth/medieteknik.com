import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import type { InvoiceData } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import {
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'

interface Props {
  language: LanguageCode
  invoiceData: InvoiceData
  totalAmount: number
}

export function InvoiceMetadata({ language, invoiceData, totalAmount }: Props) {
  return (
    <Card className='shadow-md'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-semibold leading-tight'>
          Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Paid Status */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <Cog6ToothIcon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium'>
              Paid Status
            </p>
            <div className='mt-1'>
              <Badge
                variant={
                  invoiceData.paidStatus === 'no_chapter'
                    ? 'destructive'
                    : 'default'
                }
              >
                {invoiceData.paidStatus === 'no_chapter'
                  ? 'No, the chapter should pay'
                  : 'Yes, the chapter has paid'}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <ChatBubbleLeftIcon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium'>
              Description
            </p>
            <p className='mt-1'>{invoiceData.description}</p>
          </div>
        </div>

        <Separator />

        {/* Invoice Status */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <AdjustmentsHorizontalIcon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium mb-2'>
              Invoice Status
            </p>
            <div className='grid grid-cols-2 gap-y-2'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='original'
                  disabled
                  checked={invoiceData.isOriginalInvoice}
                />
                <label htmlFor='original' className='text-sm'>
                  Original Invoice
                </label>
              </div>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='booked'
                  disabled
                  checked={invoiceData.isInvoiceBooked}
                />
                <label htmlFor='booked' className='text-sm'>
                  Booked
                </label>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Amount */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <CreditCardIcon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium'>Amount</p>
            <p className='mt-1 text-lg font-semibold'>
              {totalAmount.toLocaleString(language, {
                currency: 'SEK',
                style: 'currency',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <Separator />

        {/* Dates */}
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 p-2 rounded-md'>
            <CalendarIcon className='w-6 h-6 text-primary' />
          </div>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground font-medium mb-2'>
              Important Dates
            </p>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Invoice Date</p>
                <p className='font-medium'>
                  {invoiceData.invoiceDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Due Date</p>
                <p className='font-medium'>
                  {invoiceData.invoiceDueDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
