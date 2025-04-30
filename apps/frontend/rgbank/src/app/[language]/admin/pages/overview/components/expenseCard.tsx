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
import type { ExpenseResponse } from '@/models/Expense'
import type { LanguageCode } from '@/models/Language'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

interface Props {
  language: LanguageCode
  expense: ExpenseResponse & { type: 'expense' }
  short?: boolean
}

export default function ExpenseCard({ language, expense, short }: Props) {
  return (
    <Link
      href={`/${language}/expense/${expense.expense_id}`}
      className='w-full h-full hover:scale-[1.01] transition-transform duration-200 ease-in-out'
    >
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <ExpenseBadge type={expense.type} />
            <ExpenseStatusBadge status={expense.status} short />
            {expense.committee && (
              <div
                className='p-1 bg-white rounded-lg'
                title={expense.committee.translations[0].title}
              >
                <Image
                  src={expense.committee.logo_url}
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
            title={expense.expense_id}
          >
            {expense.title}
          </CardTitle>
          {short ? (
            <VisuallyHidden>
              <CardDescription>{expense.description}</CardDescription>
            </VisuallyHidden>
          ) : (
            <CardDescription>{expense.description}</CardDescription>
          )}
        </CardHeader>
        {!short && (
          <>
            <CardContent className='grid grid-cols-[auto_auto] grid-rows-2 pb-0'>
              <p className='text-sm'>Created at</p>
              <p className='text-sm'>Amount</p>
              <p className='text-sm text-muted-foreground'>
                {new Date(expense.created_at).toLocaleDateString()}
              </p>
              <p className='text-sm text-muted-foreground'>
                {expense.amount?.toLocaleString(language, {
                  currency: 'SEK',
                  style: 'currency',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </CardContent>
            {expense.student && (
              <>
                <div className='px-6 my-4'>
                  <Separator />
                </div>
                <CardFooter className='flex items-center gap-2'>
                  {expense.student.profile_picture_url ? (
                    <Image
                      src={expense.student.profile_picture_url}
                      alt='Profile Picture'
                      width={24}
                      height={24}
                      className='rounded-full'
                    />
                  ) : (
                    <div>
                      {expense.student.first_name.charAt(0)}{' '}
                      {expense.student.last_name?.charAt(0)}
                    </div>
                  )}
                  <span className='text-sm font-medium'>
                    {expense.student.first_name} {expense.student.last_name}
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
