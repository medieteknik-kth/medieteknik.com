'use client'

import ExpenseDetails from '@/app/[language]/expense/[expenseId]/expenseDetails'
import HeaderGap from '@/components/header/components/HeaderGap'
import DetailProvider from '@/context/DetailContext'
import type { ExpenseResponseDetailed } from '@/models/Expense'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'
import useSWR from 'swr'

interface Params {
  language: LanguageCode
  expenseId: string
}

interface Props {
  params: Promise<Params>
}

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json())

export default function ExpensePage(props: Props) {
  const { isLoading, isAuthenticated } = useAuthentication()
  const router = useRouter()
  const { language, expenseId } = use(props.params)
  const { data, error } = useSWR<ExpenseResponseDetailed>(
    `/api/rgbank/expenses/${expenseId}`,
    fetcher
  )

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push(`/${language}`)
    }
  }, [isLoading, isAuthenticated, language, router])

  if (error) {
    return (
      <div className='container min-h-screen flex flex-col items-center justify-center gap-4'>
        <h1 className='text-3xl font-bold'>Error loading expense</h1>
        <p className='text-muted-foreground'>
          An error occurred while loading the expense. Please try again later.
        </p>
      </div>
    )
  }
  if (!data) {
    return (
      <div className='container min-h-screen flex flex-col items-center justify-center gap-4'>
        <h1 className='text-3xl font-bold'>Loading expense...</h1>
        <p className='text-muted-foreground'>
          Please wait while we load the expense details.
        </p>
      </div>
    )
  }

  const expense = data.expense
  const student = data.student
  const bankAccount = data.bank_information
  const thread = data.thread

  return (
    <main>
      <HeaderGap />
      <div className='container '>
        <DetailProvider
          defaultValues={{
            expense,
            student,
            bankAccount,
            thread,
          }}
        >
          <ExpenseDetails language={language} />
        </DetailProvider>
      </div>
    </main>
  )
}
