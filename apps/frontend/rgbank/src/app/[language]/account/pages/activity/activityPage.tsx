import { fontJetBrainsMono } from '@/app/fonts'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ExpenseResponse } from '@/models/Expense'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import { ArrowDownIcon } from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'

interface Props {
  language: LanguageCode
  expenses?: ExpenseResponse[]
  invoices?: InvoiceResponse[]
}

export default function ActivityPage({ language, expenses, invoices }: Props) {
  let totalExpenditure = invoices
    ? invoices.reduce((acc, invoice) => {
        if (invoice.status === 'PAID' || invoice.status === 'BOOKED') {
          return acc + (invoice.amount || 0)
        }

        return acc
      }, 0) || 0
    : 0

  console.log(expenses)

  totalExpenditure += expenses
    ? expenses.reduce((acc, expense) => {
        if (expense.status === 'PAID' || expense.status === 'BOOKED') {
          return acc + (expense.amount || 0)
        }

        return acc
      }, 0) || 0
    : 0

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
                {totalExpenditure}
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
          {expenses && expenses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
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
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses?.map((expense) => (
                        <TableRow key={expense.expense_id}>
                          <TableCell>{expense.expense_id}</TableCell>
                          <TableCell>
                            {expense.committee?.translations[0].title}
                          </TableCell>
                          <TableCell>
                            {new Date(expense.date).toLocaleDateString(
                              language
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {invoices && invoices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  You have <span>{invoices.length} invoices</span> transactions
                  awaiting approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices?.map((invoice) => (
                        <TableRow key={invoice.invoice_id}>
                          <TableCell
                            className={`${fontJetBrainsMono.className} font-mono`}
                          >
                            <Button variant='link' size='sm' asChild>
                              <Link
                                href={`/${language}/invoice/${invoice.invoice_id}`}
                              >
                                {invoice.invoice_id}
                              </Link>
                            </Button>
                          </TableCell>
                          <TableCell>
                            <ExpenseStatusBadge status={invoice.status} />
                          </TableCell>
                          <TableCell>
                            {invoice.amount?.toLocaleString(language, {
                              style: 'currency',
                              currency: 'SEK',
                            })}
                          </TableCell>
                          <TableCell className='text-right space-x-2'>
                            <Button variant='outline' size='sm' asChild>
                              <Link
                                href={`/${language}/invoice/${invoice.invoice_id}`}
                              >
                                View
                              </Link>
                            </Button>
                            {invoice.status === 'UNCONFIRMED' && (
                              <Button variant='destructive' size='sm'>
                                Delete
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
