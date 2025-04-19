'use client'

import { PopIn } from '@/components/animation/pop-in'
import HeaderGap from '@/components/header/components/HeaderGap'
import { Badge } from '@/components/ui/badge'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { LanguageCode } from '@/models/Language'
import type Statistic from '@/models/Statistic'
import type { MonthlyStatistic, TopStatistic } from '@/models/Statistic'
import {
  AdjustmentsHorizontalIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { getYear, setMonth } from 'date-fns'
import { redirect } from 'next/navigation'
import { useCallback, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface Props {
  language: LanguageCode
  allYears: number[]
  providedYear?: string
  allTimeCommitteesStatistics: Statistic[]
  yearCommitteesStatistics: Statistic[]
  allTimeTopStudentsStatistics: TopStatistic[]
  yearTopStudentsStatistics: TopStatistic[]
  yearStudentsStatistics: Statistic[]
  monthStudentsStatistics?: Statistic[]
  previousMonthStudentsStatistics?: Statistic[]
  monthlyStatistics: MonthlyStatistic[]
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#FF9F40',
  '#4BC0C0',
  '#9966FF',
]

export default function Statistics({
  language,
  allYears,
  providedYear,
  allTimeCommitteesStatistics,
  yearCommitteesStatistics,
  allTimeTopStudentsStatistics,
  yearTopStudentsStatistics,
  yearStudentsStatistics,
  monthStudentsStatistics,
  previousMonthStudentsStatistics,
  monthlyStatistics,
}: Props) {
  const [yearFilter] = useState(providedYear || getYear(new Date()).toString())
  const [leaderboardView, setLeaderboardView] = useState('yearly')

  const changeYear = useCallback(
    (year: string) => {
      if (year === getYear(new Date()).toString()) {
        redirect(`/${language}/statistics`)
      }

      redirect(`/${language}/statistics/year/${year}`)
    },
    [language]
  )

  // Calculate total expenses
  const totalExpenses = yearStudentsStatistics.reduce(
    (acc, curr) => acc + curr.value,
    0
  )

  // Calculate month-over-month change
  const currentMonth =
    monthStudentsStatistics?.reduce((acc, curr) => acc + curr.value, 0) || 0

  const previousMonth =
    previousMonthStudentsStatistics?.reduce(
      (acc, curr) => acc + curr.value,
      0
    ) || 0

  const monthlyChange =
    previousMonth !== 0
      ? ((currentMonth - previousMonth) / previousMonth) * 100
      : 100

  const isMonthlyIncrease = monthlyChange > 0

  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const month = setMonth(new Date(), index)
    const monthName = month.toLocaleString(language, { month: 'short' })
    const amount =
      monthlyStatistics.find((statistic) => statistic.month === index + 1)
        ?.total_value || 0

    return {
      month: monthName,
      amount,
    }
  })

  const committeeData = yearCommitteesStatistics.map((statistic) => {
    if (!statistic.committee) return null
    return {
      name: statistic.committee.translations[0].title,
      value: statistic.value,
    }
  })

  const isCurrentYear = Number.parseInt(yearFilter) === getYear(new Date())

  return (
    <main className='relative overflow-y-hidden overflow-x-visible'>
      <HeaderGap />

      <div className='container mx-auto py-8 flex flex-col gap-8'>
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
              Expense Statistics
            </h1>
            <span className='text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300'>
              {yearFilter}
            </span>
          </div>
          <p className='text-muted-foreground'>
            Overview of expenses and trends over time. Updates every week.
          </p>
        </div>

        {/* Overview Cards */}
        <div className='grid gap-6 xl:grid-cols-3 z-10'>
          <PopIn className={!isCurrentYear ? 'col-span-2' : ''}>
            <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300 shadow-red-600/10'>
              <CardHeader className='pb-2'>
                <CardDescription className='text-sm font-medium text-muted-foreground'>
                  Total Expenses
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
                  {isCurrentYear ? 'Year to date' : 'For the year'}
                </div>
              </CardContent>
            </Card>
          </PopIn>

          {isCurrentYear && (
            <PopIn>
              <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300 shadow-green-600/10'>
                <CardHeader className='pb-2'>
                  <CardDescription className='text-sm font-medium text-muted-foreground'>
                    Current Month
                  </CardDescription>
                  <CardTitle className='text-3xl font-bold flex items-center'>
                    <div className='flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mr-4'>
                      <ChartBarIcon className='h-6 w-6 text-green-600 dark:text-green-400' />
                    </div>
                    {currentMonth.toLocaleString(language, {
                      currency: 'SEK',
                      style: 'currency',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center text-sm'>
                    {isMonthlyIncrease ? (
                      <Badge
                        className='bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 flex items-center gap-1'
                        variant='outline'
                      >
                        <ArrowTrendingUpIcon className='w-3.5 h-3.5' />
                        {Math.abs(monthlyChange).toFixed(1)}% from last month
                      </Badge>
                    ) : (
                      <Badge
                        className='bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 flex items-center gap-1'
                        variant='outline'
                      >
                        <ArrowTrendingDownIcon className='w-3.5 h-3.5' />
                        {Math.abs(monthlyChange).toFixed(1)}% from last month
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </PopIn>
          )}

          <PopIn>
            <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300 shadow-blue-600/10'>
              <CardHeader className='pb-2'>
                <CardDescription className='text-sm font-medium text-muted-foreground'>
                  Year Filter
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
                  Filter all charts and data
                </div>
              </CardContent>
            </Card>
          </PopIn>
        </div>

        {/* Leaderboards Section */}
        <div className='z-10'>
          <Tabs defaultValue='individuals' className='w-full'>
            <div className='flex justify-between items-center mb-4'>
              <TabsList>
                <TabsTrigger value='individuals'>
                  Individual Leaderboard
                </TabsTrigger>
                <TabsTrigger value='committees'>
                  Committee Leaderboard
                </TabsTrigger>
              </TabsList>

              <div className='flex items-center gap-2'>
                <span className='text-sm text-muted-foreground'>View:</span>
                <Tabs
                  value={leaderboardView}
                  onValueChange={setLeaderboardView}
                  className='w-[200px]'
                >
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='yearly'>Yearly</TabsTrigger>
                    <TabsTrigger value='total'>Total</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <TabsContent value='individuals'>
              <PopIn>
                <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300 dark:shadow-primary/10'>
                  <CardHeader>
                    <CardTitle>Top Spenders - Individuals</CardTitle>
                    <CardDescription>
                      {leaderboardView === 'yearly' ? 'Yearly' : 'All-time'}{' '}
                      highest expense contributors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='rounded-md border'>
                      <div className='grid grid-cols-12 bg-muted p-4 text-sm font-medium'>
                        <div className='col-span-1'>#</div>
                        <div className='col-span-5'>Name</div>
                        <div className='col-span-3 text-right'>Amount</div>
                      </div>
                      {leaderboardView === 'yearly' ? (
                        yearTopStudentsStatistics.length === 0 ? (
                          <div className='grid grid-cols-12 p-4 text-sm items-center border-t'>
                            <div className='col-span-12 text-center text-muted-foreground'>
                              No statistics available for this year
                            </div>
                          </div>
                        ) : (
                          yearTopStudentsStatistics.map((statistic, index) => {
                            if (!statistic.student) return null

                            return (
                              <div
                                key={
                                  statistic.student.first_name +
                                  statistic.student.last_name
                                }
                                className='grid grid-cols-12 p-4 text-sm items-center border-t'
                              >
                                <div
                                  className={`w-6 h-6 text-xs font-bold grid place-items-center rounded-full ${index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500' : index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' : index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500' : 'bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-500'}`}
                                >
                                  {index + 1}
                                </div>
                                <div className='col-span-5'>
                                  {`${statistic.student.first_name} ${statistic.student.last_name}`}
                                </div>
                                <div className='col-span-3 text-right font-medium'>
                                  <span className='mr-2 text-muted-foreground select-none'>
                                    SEK
                                  </span>
                                  {statistic.total_value.toLocaleString()}
                                </div>
                              </div>
                            )
                          })
                        )
                      ) : (
                        leaderboardView === 'total' &&
                        (allTimeTopStudentsStatistics.length === 0 ? (
                          <div className='grid grid-cols-12 p-4 text-sm items-center border-t'>
                            <div className='col-span-12 text-center text-muted-foreground'>
                              No statistics available for this year
                            </div>
                          </div>
                        ) : (
                          allTimeTopStudentsStatistics.map(
                            (statistic, index) => {
                              if (!statistic.student) return null

                              return (
                                <div
                                  key={
                                    statistic.student.first_name +
                                    statistic.student.last_name
                                  }
                                  className='grid grid-cols-12 p-4 text-sm items-center border-t'
                                >
                                  <div
                                    className={`w-6 h-6 text-xs font-bold grid place-items-center rounded-full ${index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500' : index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' : index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500' : 'bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-500'}`}
                                  >
                                    {index + 1}
                                  </div>
                                  <div className='col-span-5'>
                                    {`${statistic.student.first_name} ${statistic.student.last_name}`}
                                  </div>
                                  <div className='col-span-3 text-right font-medium'>
                                    <span className='mr-2 text-muted-foreground select-none'>
                                      SEK
                                    </span>
                                    {statistic.total_value.toLocaleString()}
                                  </div>
                                </div>
                              )
                            }
                          )
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </PopIn>
            </TabsContent>

            <TabsContent value='committees'>
              <PopIn>
                <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300 dark:shadow-primary/10'>
                  <CardHeader>
                    <CardTitle>Top Spenders - Committees</CardTitle>
                    <CardDescription>
                      {leaderboardView === 'yearly' ? 'Yearly' : 'All-time'}{' '}
                      highest expense departments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='rounded-md border'>
                      <div className='grid grid-cols-12 bg-muted p-4 text-sm font-medium'>
                        <div className='col-span-1'>#</div>
                        <div className='col-span-5'>Committee</div>
                        <div className='col-span-3 text-right'>Amount</div>
                      </div>
                      {leaderboardView === 'yearly' ? (
                        yearCommitteesStatistics.length === 0 ? (
                          <div className='grid grid-cols-12 p-4 text-sm items-center border-t'>
                            <div className='col-span-12 text-center text-muted-foreground'>
                              No statistics available for this year
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
                              No statistics available for this year
                            </div>
                          </div>
                        ) : (
                          allTimeCommitteesStatistics.map(
                            (statistic, index) => {
                              if (!statistic.committee) return null

                              return (
                                <div
                                  key={
                                    statistic.committee.translations[0].title
                                  }
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
                            }
                          )
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </PopIn>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chart Section */}
        <div className='grid gap-6 md:grid-cols-2 z-10'>
          <PopIn>
            <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300 dark:shadow-primary/10'>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
                <CardDescription>
                  Expense trends throughout the year
                </CardDescription>
              </CardHeader>
              <CardContent className='h-80'>
                <ResponsiveContainer
                  width='100%'
                  height='100%'
                  className='text-sm'
                >
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip formatter={(value) => `SEK ${value}`} />
                    <Area
                      type='monotone'
                      dataKey='amount'
                      name='Expenses'
                      stroke='hsl(var(--primary))'
                      fillOpacity={0.2}
                      fill='hsl(var(--primary))'
                      dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </PopIn>

          <PopIn>
            <Card className='border-none shadow-lg hover:shadow-xl transition-shadow duration-300 dark:shadow-primary/10'>
              <CardHeader>
                <CardTitle>Expenses by Committee</CardTitle>
                <CardDescription>
                  Distribution across committees for the year
                </CardDescription>
              </CardHeader>

              <CardContent className='h-80'>
                {committeeData.length === 0 ? (
                  <div className='text-center text-muted-foreground h-full grid place-items-center'>
                    No statistics available for this year
                  </div>
                ) : (
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={committeeData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='value'
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {committeeData.map((entry, index) => {
                          if (!entry) return null
                          return (
                            <Cell
                              key={`cell-${entry.name}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        })}
                      </Pie>
                      <Tooltip formatter={(value) => `SEK ${value}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </PopIn>
        </div>
      </div>
    </main>
  )
}
