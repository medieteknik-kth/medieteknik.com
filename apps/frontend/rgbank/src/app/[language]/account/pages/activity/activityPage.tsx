import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExpenseBadge } from '@/components/ui/expense-badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { LanguageCode } from '@/models/Language'
import { ArrowDownIcon } from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'

interface Props {
  language: LanguageCode
}

export default function ActivityPage({ language }: Props) {
  const awaitingApproval = [
    {
      id: 1,
      type: 'invoice',
      committee: 'Styrelsen',
      date: '2023-10-01',
      amount: 1000,
    },
    {
      id: 2,
      type: 'expense',
      committee: 'Styrelsen',
      date: '2023-10-02',
      amount: 2000,
    },
    {
      id: 3,
      type: 'invoice',
      committee: 'Styrelsen',
      date: '2023-10-03',
      amount: 3000,
    },
  ]

  return (
    <section className='w-full h-fit max-w-[1100px] mb-8 2xl:mb-0'>
      <div className='w-full flex flex-col gap-4 h-fit'>
        <div className='-full px-4 pt-4'>
          <h2 className='text-lg font-bold'>Activity</h2>
          <p className='text-sm text-muted-foreground'>
            View your activity history and manage your account settings.
          </p>
          <Separator className='bg-yellow-400 mt-4' />
        </div>

        <div className='grid gap-4 grid-cols-2 mx-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Total Expenditure</CardDescription>
              <CardTitle className='text-4xl flex items-center'>
                <span className='text-2xl mr-2 text-muted-foreground select-none'>
                  SEK
                </span>
                20 000
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm text-muted-foreground'>Year to date</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Current Month</CardDescription>
              <CardTitle className='text-4xl flex items-center'>
                <span className='text-2xl mr-2 text-muted-foreground select-none'>
                  SEK
                </span>
                2 000
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center text-sm'>
                <ArrowDownIcon className='h-4 w-4 mr-1 text-green-500' />
                <span className={'text-green-500'}>20.5% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='mx-4 flex flex-col gap-4'>
          <Card>
            <CardHeader>
              <CardTitle>Awaiting Approval</CardTitle>
              <CardDescription>
                You have 3 transactions awaiting approval.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Committee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {awaitingApproval.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Button
                            variant={'link'}
                            className='p-0 h-auto font-medium'
                            asChild
                          >
                            <Link href={`/${language}/expense/${item.id}`}>
                              {item.id}
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <ExpenseBadge
                            type={item.type as 'invoice' | 'expense'}
                          />
                        </TableCell>
                        <TableCell>{item.committee}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className='text-right'>
                          <span className='text-muted-foreground select-none mr-1 text-xs'>
                            SEK
                          </span>
                          {item.amount}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button variant={'link'}>Cancel</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Previous Transactions</CardTitle>
              <CardDescription>
                Previous transactions that have been approved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Committee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {awaitingApproval.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Button
                            variant={'link'}
                            className='p-0 h-auto font-medium'
                          >
                            {item.id}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <ExpenseBadge
                            type={item.type as 'invoice' | 'expense'}
                          />
                        </TableCell>
                        <TableCell>{item.committee}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className='text-right'>
                          <span className='text-muted-foreground select-none mr-1 text-xs'>
                            SEK
                          </span>
                          {item.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
