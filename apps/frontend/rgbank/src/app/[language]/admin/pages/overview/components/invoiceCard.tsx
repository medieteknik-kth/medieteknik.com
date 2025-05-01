import { fontJetBrainsMono } from '@/app/fonts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExpenseBadge, ExpenseStatusBadge } from '@/components/ui/expense-badge'
import { Separator } from '@/components/ui/separator'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

interface Props {
  language: LanguageCode
  invoice: InvoiceResponse & { type: 'invoice' }
  short?: boolean
}

export default function InvoiceCard({ language, invoice, short }: Props) {
  return (
    <Link
      href={`/${language}/invoice/${invoice.invoice_id}`}
      className='w-full h-full hover:scale-[1.01] transition-transform duration-200 ease-in-out'
    >
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <ExpenseBadge type={invoice.type} />
            <ExpenseStatusBadge status={invoice.status} short />
            {invoice.committee && (
              <div
                className='p-1 bg-white rounded-lg'
                title={invoice.committee.translations[0].title}
              >
                <Image
                  src={invoice.committee.logo_url}
                  alt='Committee Logo'
                  width={16}
                  height={16}
                  unoptimized
                />
              </div>
            )}
          </div>
          <CardTitle
            className={`${fontJetBrainsMono.className} font-mono text-lg font-bold truncate tracking-tight max-w-96`}
            title={invoice.title}
          >
            {invoice.title}
          </CardTitle>
          {short ? (
            <VisuallyHidden>
              <CardDescription>{invoice.description}</CardDescription>
            </VisuallyHidden>
          ) : (
            <CardDescription>{invoice.description}</CardDescription>
          )}
        </CardHeader>
        {!short && (
          <>
            <CardContent className='grid grid-cols-[auto_auto_auto] grid-rows-2 pb-0'>
              <p className='text-sm'>Created at</p>
              <p className='text-sm'>Due Date</p>
              <p className='text-sm'>Amount</p>
              <p className='text-sm text-muted-foreground'>
                {new Date(invoice.created_at).toLocaleDateString()}
              </p>
              <p className='text-sm text-muted-foreground'>
                {new Date(invoice.due_date).toLocaleDateString()}
              </p>
              <p className='text-sm text-muted-foreground'>
                {invoice.amount?.toLocaleString(language, {
                  currency: 'SEK',
                  style: 'currency',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </CardContent>
            {invoice.student && (
              <>
                <div className='px-6 my-4'>
                  <Separator />
                </div>
                <CardFooter className='flex items-center gap-2'>
                  {invoice.student.profile_picture_url ? (
                    <Image
                      src={invoice.student.profile_picture_url}
                      alt='Profile Picture'
                      width={24}
                      height={24}
                      className='rounded-full'
                    />
                  ) : (
                    <div>
                      {invoice.student.first_name.charAt(0)}{' '}
                      {invoice.student.last_name?.charAt(0)}
                    </div>
                  )}
                  <span className='text-sm font-medium'>
                    {invoice.student.first_name} {invoice.student.last_name}
                  </span>
                </CardFooter>
              </>
            )}
          </>
        )}
      </Card>
    </Link>
  )
}
