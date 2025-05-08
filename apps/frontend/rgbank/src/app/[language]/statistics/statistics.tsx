'use client'

import { useTranslation } from '@/app/i18n/client'
import { PopIn } from '@/components/animation/pop-in'
import HeaderGap from '@/components/header/components/HeaderGap'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type Statistic from '@/models/Statistic'
import {
  AdjustmentsHorizontalIcon,
  BanknotesIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { getYear } from 'date-fns'
import { redirect } from 'next/navigation'
import { useCallback, useState } from 'react'

interface Props {
  language: LanguageCode
  allYears: number[]
  providedYear?: string
  allTimeCommitteesStatistics: Statistic[]
  yearCommitteesStatistics: Statistic[]
}

export default function Statistics({
  language,
  allYears,
  providedYear,
  allTimeCommitteesStatistics,
  yearCommitteesStatistics,
}: Props) {
  const [yearFilter] = useState(providedYear || getYear(new Date()).toString())
  const [leaderboardView] = useState('yearly')
  const { t } = useTranslation(language, 'statistics')

  const changeYear = useCallback(
    (year: string) => {
      if (year === getYear(new Date()).toString()) {
        redirect(`/${language}/statistics`)
      }

      redirect(`/${language}/statistics/year/${year}`)
    },
    [language]
  )

  const totalExpenses = yearCommitteesStatistics.reduce((acc, statistic) => {
    if (!statistic.committee) return acc
    return acc + statistic.value
  }, 0)

  const isCurrentYear = Number.parseInt(yearFilter) === getYear(new Date())

  return (
    <main className='relative overflow-y-hidden overflow-x-visible'>
      <HeaderGap />

      <div className='px-2 xs:px-0 xs:container mx-auto py-8 flex flex-col gap-8'>
        {/* Headers */}
        <div className='space-y-1 z-10'>
          <div className='flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4'>
            <h1
              className={cn(
                'text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r/oklch',
                Number.parseInt(yearFilter) % 10 === 0
                  ? 'from-[#FF5733] to-[#FFC300]' // Neon Orange to Neon Yellow
                  : Number.parseInt(yearFilter) % 10 === 1
                    ? 'from-[#DAF7A6] to-[#FF33FF]' // Neon LightGreen to Neon Magenta
                    : Number.parseInt(yearFilter) % 10 === 2
                      ? 'from-[#33FF57] to-[#33FFF3]' // Neon Green to Neon Aqua
                      : Number.parseInt(yearFilter) % 10 === 3
                        ? 'from-[#FF3333] to-[#FF5733]' // Neon Red to Neon Orange
                        : Number.parseInt(yearFilter) % 10 === 4
                          ? 'from-[#33FFBD] to-[#FF33A6]' // Neon Teal to Neon Pink
                          : Number.parseInt(yearFilter) % 10 === 5
                            ? 'from-[#5733FF] to-[#33A6FF]' // Neon Purple to Neon Blue
                            : Number.parseInt(yearFilter) % 10 === 6
                              ? 'from-[#FFC300] to-[#DAF7A6]' // Neon Yellow to Neon LightGreen
                              : Number.parseInt(yearFilter) % 10 === 7
                                ? 'from-[#FF33A6] to-[#33FFBD]' // Neon Pink to Neon Teal
                                : Number.parseInt(yearFilter) % 10 === 8
                                  ? 'from-[#33FFF3] to-[#33FF57]' // Neon Aqua to Neon Green
                                  : 'from-[#FF5733] to-[#FF3333]' // Neon Orange to Neon Red
              )}
            >
              {t('title')}
            </h1>
            <span className='text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300'>
              {yearFilter}
            </span>
          </div>
          <p className='text-muted-foreground'>{t('description')}</p>
        </div>

        {/* Overview Cards */}
        <div className='grid gap-6 xl:grid-cols-3 z-10'>
          <PopIn className='xl:col-span-2'>
            <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300 shadow-red-600/10'>
              <CardHeader className='pb-2'>
                <CardDescription className='text-sm font-medium text-muted-foreground'>
                  {t('totalExpenses')}
                </CardDescription>
                <CardTitle className='text-4xl font-bold flex items-center'>
                  <div className='flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mr-4'>
                    <BanknotesIcon className='h-6 w-6 text-red-600 dark:text-red-400' />
                  </div>
                  {totalExpenses.toLocaleString(language, {
                    currency: 'SEK',
                    style: 'currency',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-sm text-muted-foreground flex items-center'>
                  <CalendarIcon className='h-5 w-5 mr-1 text-muted-foreground' />
                  {isCurrentYear ? t('yearToDate') : t('forTheYear')}
                </div>
              </CardContent>
            </Card>
          </PopIn>

          <PopIn>
            <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300 shadow-blue-600/10'>
              <CardHeader className='pb-2'>
                <CardDescription className='text-sm font-medium text-muted-foreground'>
                  {t('yearFilter.label')}
                </CardDescription>
                <CardTitle className='text-2xl font-bold flex items-center gap-4'>
                  <div className='flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30'>
                    <AdjustmentsHorizontalIcon className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                  </div>
                  <Select value={yearFilter} onValueChange={changeYear}>
                    <SelectTrigger className='max-w-[200px] border-none shadow-sm bg-gray-50 dark:bg-gray-900'>
                      <SelectValue placeholder='Select Year' />
                    </SelectTrigger>
                    <SelectContent>
                      {allYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-sm text-muted-foreground'>
                  {t('yearFilter.description')}
                </div>
              </CardContent>
            </Card>
          </PopIn>
        </div>

        {/* Leaderboards Section */}
        <div className='z-10'>
          <PopIn>
            <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300 shadow-green-600/10'>
              <CardHeader>
                <CardTitle>{t('committeeLeaderboard.title')}</CardTitle>
                <CardDescription>
                  {t('committeeLeaderboard.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='rounded-md border'>
                  <div className='grid grid-cols-12 bg-muted p-4 text-sm font-medium'>
                    <div className='col-span-1 pl-2'>#</div>
                    <div className='col-span-5'>
                      {t('committeeLeaderboard.committee')}
                    </div>
                    <div className='col-span-3 text-right'>
                      {t('committeeLeaderboard.amount')}
                    </div>
                  </div>
                  {leaderboardView === 'yearly' ? (
                    yearCommitteesStatistics.length === 0 ? (
                      <div className='grid grid-cols-12 p-4 text-sm items-center border-t'>
                        <div className='col-span-12 text-center text-muted-foreground'>
                          {t('committeeLeaderboard.none')}
                        </div>
                      </div>
                    ) : (
                      yearCommitteesStatistics.map((statistic, index) => {
                        if (!statistic.committee) return null

                        return (
                          <div
                            key={statistic.committee.translations[0].title}
                            className='grid grid-cols-12 p-4 text-sm items-center border-t'
                          >
                            <div
                              className={`w-6 h-6 text-xs font-bold grid place-items-center rounded-full ${index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500' : index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' : index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500' : 'bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-500'}`}
                            >
                              {index + 1}
                            </div>
                            <div className='col-span-5'>
                              {statistic.committee.translations[0].title}
                            </div>
                            <div className='col-span-3 text-right font-medium'>
                              <span className='mr-2 text-muted-foreground select-none'>
                                SEK
                              </span>
                              {statistic.value.toLocaleString()}
                            </div>
                          </div>
                        )
                      })
                    )
                  ) : (
                    leaderboardView === 'total' &&
                    (allTimeCommitteesStatistics.length === 0 ? (
                      <div className='grid grid-cols-12 p-4 text-sm items-center border-t'>
                        <div className='col-span-12 text-center text-muted-foreground'>
                          {t('committeeLeaderboard.none')}
                        </div>
                      </div>
                    ) : (
                      allTimeCommitteesStatistics.map((statistic, index) => {
                        if (!statistic.committee) return null

                        return (
                          <div
                            key={statistic.committee.translations[0].title}
                            className='grid grid-cols-12 p-4 text-sm items-center border-t'
                          >
                            <div
                              className={`w-6 h-6 text-xs font-bold grid place-items-center rounded-full ${index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500' : index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' : index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500' : 'bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-500'}`}
                            >
                              {index + 1}
                            </div>
                            <div className='col-span-5'>
                              {statistic.committee.translations[0].title}
                            </div>
                            <div className='col-span-3 text-right font-medium'>
                              <span className='mr-2 text-muted-foreground select-none'>
                                SEK
                              </span>
                              {statistic.value.toLocaleString()}
                            </div>
                          </div>
                        )
                      })
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </PopIn>
        </div>
      </div>
    </main>
  )
}
