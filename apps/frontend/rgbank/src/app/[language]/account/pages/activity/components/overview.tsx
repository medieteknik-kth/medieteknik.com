import { useTranslation } from '@/app/i18n/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { NumberTicker } from '@/components/ui/number-ticker'
import type { ExpenseResponse } from '@/models/Expense'
import type { InvoiceResponse } from '@/models/Invoice'
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { isSameMonth, subMonths } from 'date-fns'

interface Props {
  language: LanguageCode
  allExpenses: ExpenseResponse[]
  allInvoices: InvoiceResponse[]
}

export default function ActivityOverview({
  language,
  allExpenses,
  allInvoices,
}: Props) {
  const { t } = useTranslation(language, 'account')

  const now = new Date()
  const prevMonth = subMonths(now, 1)

  let totalExpenditure = 0
  let currentMonthSum = 0
  let previousMonthSum = 0

  for (const expense of allExpenses) {
    const isPaidOrBooked =
      expense.status === 'PAID' || expense.status === 'BOOKED'
    const amount = expense.amount || 0

    if (isPaidOrBooked) {
      totalExpenditure += amount

      const createdDate = new Date(expense.created_at)
      if (isSameMonth(createdDate, now)) {
        currentMonthSum += amount
      } else if (isSameMonth(createdDate, prevMonth)) {
        previousMonthSum += amount
      }
    }
  }

  for (const invoice of allInvoices) {
    const isPaidOrBooked =
      invoice.status === 'PAID' || invoice.status === 'BOOKED'
    const amount = invoice.amount || 0

    if (isPaidOrBooked) {
      totalExpenditure += amount

      const createdDate = new Date(invoice.created_at)
      if (isSameMonth(createdDate, now)) {
        currentMonthSum += amount
      } else if (isSameMonth(createdDate, prevMonth)) {
        previousMonthSum += amount
      }
    }
  }

  const percentageChange =
    previousMonthSum !== 0
      ? ((currentMonthSum - previousMonthSum) / previousMonthSum) * 100
      : 100

  const noChange = percentageChange === 0
  const isPositiveChange = percentageChange < 0

  const percentageChangeFormatted = percentageChange.toLocaleString(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const specialNumbers = [
    42, 420, 666, 3_141, 8_008, 13_337, 420_69, 123_456, 666_666, 777_777,
    999_999,
  ]
  const benchmarkNumbers = [
    500, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000, 10_000_000,
  ]

  const randomNumber = Math.floor(Math.random() * 3) + 1

  return (
    <div className='grid gap-4 lg:grid-cols-2 mx-4'>
      <Card>
        <CardHeader className='pb-2'>
          <CardDescription>{t('activity.total_expenditure')}</CardDescription>
          <CardTitle className='text-4xl flex items-center'>
            <span className='text-2xl mr-2 text-muted-foreground select-none'>
              SEK
            </span>
            <NumberTicker
              value={totalExpenditure}
              decimalPlaces={2}
              language={language}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-muted-foreground'>
            {/* TODO: Add flavor text? */}
            {specialNumbers.includes(totalExpenditure) ? (
              <span className='text-yellow-500'>
                {t(`activity.total_expenditure.quip.${totalExpenditure}.1`)}
              </span>
            ) : (
              <span className='text-muted-foreground italic'>
                {t(
                  `activity.total_expenditure.quip.below_${benchmarkNumbers.find(
                    (num) => totalExpenditure <= num
                  )}.${randomNumber}`
                )}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-2'>
          <CardDescription>{t('activity.current_month')}</CardDescription>
          <CardTitle className='text-4xl flex items-center'>
            <span className='text-2xl mr-2 text-muted-foreground select-none'>
              SEK
            </span>
            <NumberTicker
              value={currentMonthSum}
              decimalPlaces={2}
              language={language}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center text-sm gap-2'>
            {noChange ? (
              <ArrowsUpDownIcon className='h-4 w-4 text-yellow-500' />
            ) : isPositiveChange ? (
              <ArrowTrendingDownIcon className='h-4 w-4 text-green-500' />
            ) : (
              <ArrowTrendingUpIcon className='h-4 w-4 text-red-500' />
            )}
            <span
              className={
                noChange
                  ? 'text-yellow-500'
                  : isPositiveChange
                    ? 'text-green-500'
                    : 'text-red-500'
              }
            >
              <span>{percentageChangeFormatted} % </span>
              {t('activity.current_month.difference')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
