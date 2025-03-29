'use client'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const monthlyData = [
  { name: 'Jan', amount: 1200 },
  { name: 'Feb', amount: 1900 },
  { name: 'Mar', amount: 1500 },
  { name: 'Apr', amount: 2100 },
  { name: 'May', amount: 1800 },
  { name: 'Jun', amount: 2400 },
  { name: 'Jul', amount: 2000 },
  { name: 'Aug', amount: 2200 },
  { name: 'Sep', amount: 1700 },
  { name: 'Oct', amount: 1900 },
  { name: 'Nov', amount: 2300 },
  { name: 'Dec', amount: 2800 },
]

const committeeData = [
  { name: 'Mottagningen', value: 8500 },
  { name: 'Styrelsen', value: 12000 },
  { name: 'Valberedningen', value: 6500 },
  { name: 'Kommunikationsnämnden', value: 4000 },
  { name: 'Medias Klubbmästeri', value: 3000 },
]

const individualLeaderboardData = [
  { name: 'Alex Johnson', amount: 4500, committee: 'Mottagningen' },
  { name: 'Jamie Smith', amount: 4200, committee: 'Styrelsen' },
  { name: 'Taylor Brown', amount: 3800, committee: 'Valberedningen' },
  { name: 'Casey Wilson', amount: 3500, committee: 'Kommunikationsnämnden' },
  { name: 'Morgan Lee', amount: 3200, committee: 'Medias Klubbmästeri' },
]

const committeeLeaderboardData = [
  { name: 'Mottagningen', amount: 12000, members: 8 },
  { name: 'Styrelsen', amount: 8500, members: 6 },
  { name: 'Valberedningen', amount: 6500, members: 5 },
  { name: 'Kommunikationsnämnden', amount: 4000, members: 4 },
  { name: 'Medias Klubbmästeri', amount: 3000, members: 3 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function Statistics() {
  const [yearFilter, setYearFilter] = useState('2024')
  const [leaderboardView, setLeaderboardView] = useState('yearly')

  // Calculate total expenses
  const totalExpenses = 34000

  // Calculate month-over-month change
  const currentMonth = monthlyData[monthlyData.length - 1].amount
  const previousMonth = monthlyData[monthlyData.length - 2].amount
  const monthlyChange = ((currentMonth - previousMonth) / previousMonth) * 100
  const isMonthlyIncrease = monthlyChange > 0

  return (
    <main>
      <HeaderGap />

      <div className='container mx-auto py-8 flex flex-col gap-8'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold'>Statistics</h1>
          <p className='text-muted-foreground'>
            Overview of expenses and trends over time. Updates every week.
          </p>
        </div>

        {/* Overview Cards */}
        <div className='grid gap-6 md:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle className='text-4xl flex items-center'>
                <span className='text-2xl mr-2 text-muted-foreground select-none'>
                  SEK
                </span>
                {totalExpenses.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm text-muted-foreground'>Year to date</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Current Month</CardDescription>
              <CardTitle className='text-3xl flex items-center'>
                <span className='text-2xl mr-2 text-muted-foreground select-none'>
                  SEK
                </span>
                {currentMonth.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center text-sm'>
                {isMonthlyIncrease ? (
                  <ArrowUpIcon className='h-4 w-4 mr-1 text-red-500' />
                ) : (
                  <ArrowDownIcon className='h-4 w-4 mr-1 text-green-500' />
                )}
                <span
                  className={
                    isMonthlyIncrease ? 'text-red-500' : 'text-green-500'
                  }
                >
                  {Math.abs(monthlyChange).toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Year Filter</CardDescription>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Year' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='2020'>2020</SelectItem>
                  <SelectItem value='2021'>2021</SelectItem>
                  <SelectItem value='2022'>2022</SelectItem>
                  <SelectItem value='2023'>2023</SelectItem>
                  <SelectItem value='2024'>2024</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className='text-sm text-muted-foreground'>
                Filter all charts and data
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboards Section */}
        <div>
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
              <Card>
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
                      <div className='col-span-3'>Committee</div>
                      <div className='col-span-3 text-right'>Amount</div>
                    </div>
                    {individualLeaderboardData.map((person, index) => (
                      <div
                        key={person.name}
                        className='grid grid-cols-12 p-4 text-sm items-center border-t'
                      >
                        <div className='col-span-1 font-medium'>
                          {index + 1}
                        </div>
                        <div className='col-span-5'>{person.name}</div>
                        <div className='col-span-3'>{person.committee}</div>
                        <div className='col-span-3 text-right font-medium'>
                          <span className='mr-2 text-muted-foreground select-none'>
                            SEK
                          </span>
                          {person.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='committees'>
              <Card>
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
                      <div className='col-span-3'>Members</div>
                      <div className='col-span-3 text-right'>Amount</div>
                    </div>
                    {committeeLeaderboardData.map((committee, index) => (
                      <div
                        key={committee.name}
                        className='grid grid-cols-12 p-4 text-sm items-center border-t'
                      >
                        <div className='col-span-1 font-medium'>
                          {index + 1}
                        </div>
                        <div className='col-span-5'>{committee.name}</div>
                        <div className='col-span-3'>{committee.members}</div>
                        <div className='col-span-3 text-right font-medium'>
                          ${committee.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chart Section */}
        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
              <CardDescription>
                Expense trends throughout the year
              </CardDescription>
            </CardHeader>
            <CardContent className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Line
                    type='monotone'
                    dataKey='amount'
                    stroke='hsl(var(--primary))'
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expenses by Committee</CardTitle>
              <CardDescription>Distribution across departments</CardDescription>
            </CardHeader>

            <CardContent className='h-80'>
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
                    {committeeData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
