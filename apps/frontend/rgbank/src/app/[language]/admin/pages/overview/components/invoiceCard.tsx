'use client'

import { fontJetBrainsMono } from '@/app/fonts'
import { useTranslation } from '@/app/i18n/client'
import { Badge, Label } from '@/components/ui'
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
import {
  CalendarIcon,
  HashtagIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

interface Props {
  language: LanguageCode
  invoice: InvoiceResponse & { type: 'invoice' }
  short?: boolean
}

export default function InvoiceCard({ language, invoice, short }: Props) {
  const { t } = useTranslation(language, 'activities')

  return (
    <Link
      href={`/${language}/invoice/${invoice.invoice_id}`}
      className='w-full h-full hover:scale-[1.01] transition-transform duration-200 ease-in-out'
    >
      <Card className={`${invoice.status === 'BOOKED' ? 'pb-0' : ''}`}>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <ExpenseBadge language={language} type={invoice.type} />
            <ExpenseStatusBadge
              language={language}
              status={invoice.status}
              short
            />
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
            <CardDescription
              className='text-sm text-muted-foreground max-w-96 break-words'
              title={invoice.description}
            >
              {invoice.description}
            </CardDescription>
          )}
        </CardHeader>
        {!short && (
          <>
            <CardContent className='grid grid-cols-[auto_auto_auto] grid-rows-2 pb-0'>
              <p className='text-sm'>{t('activity.table.createdAt')}</p>
              <p className='text-sm'>{t('activity.table.dueDate')}</p>
              <p className='text-sm'>{t('activity.table.amount')}</p>
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
                <div className='px-6'>
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

        {invoice.status === 'BOOKED' && invoice.booked_item && (
          <div className='px-6 space-y-2 bg-muted-foreground/10 rounded-b-lg py-4'>
            <Label className='text-sm font-bold'>
              {t('details.verification.label')}
            </Label>
            <div className='flex items-center gap-2 text-sm'>
              <HashtagIcon className='h-5 w-5 text-muted-foreground' />
              {invoice.booked_item.verification_number}
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <CalendarIcon className='h-5 w-5 text-muted-foreground' />
              {new Date(`${invoice.booked_item.paid_at}Z`).toLocaleDateString(
                language,
                {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}
            </div>
            <div className='flex items-center gap-2'>
              <UserIcon className='h-5 w-5 text-muted-foreground' />
              <div className='flex items-center gap-2'>
                {invoice.booked_item.student.profile_picture_url ? (
                  <Image
                    src={invoice.booked_item.student.profile_picture_url}
                    alt='Profile Picture'
                    width={24}
                    height={24}
                    className='rounded-full'
                  />
                ) : (
                  <div>
                    {invoice.booked_item.student.first_name.charAt(0)}{' '}
                    {invoice.booked_item.student.last_name?.charAt(0)}
                  </div>
                )}
                <span className='text-sm font-medium'>
                  {invoice.booked_item.student.first_name}{' '}
                  {invoice.booked_item.student.last_name}
                </span>
              </div>

              <Badge
                variant='outline'
                className='ml-2 text-xs font-normal bg-background'
              >
                {invoice.booked_item.committee_position.translations[0].title}
              </Badge>
            </div>
          </div>
        )}
      </Card>
    </Link>
  )
}
