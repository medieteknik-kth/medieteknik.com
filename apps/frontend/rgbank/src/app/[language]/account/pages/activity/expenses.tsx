'use client'

import ActivityFilters from '@/app/[language]/account/pages/activity/components/filter'
import TableLoading from '@/app/[language]/account/pages/activity/components/tableLoading'
import { fontJetBrainsMono } from '@/app/fonts'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ExpenseResponse } from '@/models/Expense'
import { EXPENSE_STATUS_LIST, type ExpenseStatus } from '@/models/General'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { Link } from 'next-view-transitions'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  language: LanguageCode
  expenses: ExpenseResponse[]
  expensesLoading?: boolean
}

export default function ActivityExpenses({
  language,
  expenses,
  expensesLoading,
}: Props) {
  const { t } = useTranslation(language, 'account')
  const { t: expenseT } = useTranslation(language, 'expense')
  const { t: activitiesT } = useTranslation(language, 'activities')

  const [expenseFilters, setExpenseFilters] =
    useState<ExpenseStatus[]>(EXPENSE_STATUS_LIST)

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const response = await fetch(`/api/rgbank/expenses/${expenseId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      toast.success(
        t('activity.delete.success', {
          type: expenseT('expense').toLowerCase(),
        }),
        {
          description: t('activity.delete.successDescription', {
            type: expenseT('expense').toLowerCase(),
          }),
        }
      )

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast.error(
        t('activity.delete.error', {
          type: expenseT('expense').toLowerCase(),
        }),
        {
          description: t('activity.delete.errorDescription', {
            type: expenseT('expense').toLowerCase(),
            error: (error as Error).message,
          }),
        }
      )
    }
  }

  if (!expenses || expenses.length === 0 || !Array.isArray(expenses)) {
    return <></>
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>{expenseT('expense')}</CardTitle>
        <CardDescription>
          {t('activity.totalExpenses', {
            count: expenses.length,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityFilters
          language={language}
          setFilters={setExpenseFilters}
          filters={expenseFilters}
        />
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='pl-7 w-36'>
                  {activitiesT('activity.table.title')}
                </TableHead>
                <TableHead>{activitiesT('activity.table.createdAt')}</TableHead>
                <TableHead>{activitiesT('activity.table.status')}</TableHead>
                <TableHead>{activitiesT('activity.table.amount')}</TableHead>
                <TableHead className='text-right'>
                  {activitiesT('activity.table.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expensesLoading && <TableLoading />}

              {!expensesLoading &&
                expenses
                  ?.filter((expense) => expenseFilters.includes(expense.status))
                  .map((expense) => (
                    <TableRow key={expense.expense_id}>
                      <TableCell
                        className={`${fontJetBrainsMono.className} font-mono`}
                      >
                        <Button variant='link' size='sm' asChild>
                          <Link
                            href={`/${language}/expense/${expense.expense_id}`}
                          >
                            <p
                              className='max-w-36 truncate'
                              title={expense.title}
                            >
                              {expense.title}
                            </p>
                          </Link>
                        </Button>
                      </TableCell>
                      <TableCell>
                        {new Date(expense.created_at).toLocaleDateString(
                          language,
                          {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        <ExpenseStatusBadge
                          language={language}
                          status={expense.status}
                        />
                      </TableCell>
                      <TableCell>
                        {expense.amount?.toLocaleString(language, {
                          style: 'currency',
                          currency: 'SEK',
                        })}
                      </TableCell>
                      <TableCell className='text-right space-x-2'>
                        <Button variant='outline' size='sm' asChild>
                          <Link
                            href={`/${language}/expense/${expense.expense_id}`}
                          >
                            {activitiesT('activity.table.actions.view')}
                          </Link>
                        </Button>
                        {expense.status === 'UNCONFIRMED' && (
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => {
                              handleDeleteExpense(expense.expense_id)
                            }}
                          >
                            {activitiesT('activity.table.actions.delete')}
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
  )
}
