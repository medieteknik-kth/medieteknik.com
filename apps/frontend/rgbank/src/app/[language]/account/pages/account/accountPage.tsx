'use client'

import { useTranslation } from '@/app/i18n/client'
import { Label } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  useAuthentication,
  useStudent,
} from '@/providers/AuthenticationProvider'
import { bankSchema } from '@/schemas/bank'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

interface Props {
  language: LanguageCode
  includeBanner?: boolean
}

export default function AccountPage({ language, includeBanner = true }: Props) {
  const { student, bank_account } = useStudent()
  const { setStale } = useAuthentication()
  const { t } = useTranslation(language, 'account')
  const [form, setForm] = useState({
    bank_name: bank_account?.bank_name || '',
    clearing_number: bank_account?.clearing_number || '',
    account_number: bank_account?.account_number || '',
  })
  const [formErrors, setFormErrors] = useState({
    bank_name: '',
    clearing_number: '',
    account_number: '',
  })

  const onSubmit = async (data: z.infer<typeof bankSchema>) => {
    if (!student) {
      toast.error(t('bank_account.error.title'), {
        description: t('bank_account.notLoggedIn.description'),
      })
      return
    }

    const errors = bankSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        bank_name: fieldErrors.properties?.bank_name?.errors[0] || '',
        clearing_number:
          fieldErrors.properties?.clearing_number?.errors[0] || '',
        account_number: fieldErrors.properties?.account_number?.errors[0] || '',
      })
      toast.error(t('bank_account.error.title'), {
        description: t('bank_account.error.description'),
      })
      return
    }

    const new_data = {
      ...data,
      student_id: student.student_id,
    }
    try {
      const response = await fetch('/api/rgbank/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(new_data),
      })

      if (!response.ok) {
        throw new Error(t('bank_account.error.description'))
      }

      setStale(true)
      toast.success(t('bank_account.success.title'), {
        description: t('bank_account.success.description'),
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(t('bank_account.error.title'), {
          description: error.message,
        })
      } else {
        toast.error(t('bank_account.error.title'), {
          description: t('bank_account.error.description'),
        })
      }
    }
  }

  return (
    <section className='w-full max-w-[1100px] flex flex-col mb-8 2xl:mb-0'>
      {includeBanner && (
        <div className='w-full mb-4 px-4'>
          <h2 className='text-lg font-bold'>{t('bank_account.title')}</h2>
          <p className='text-sm text-muted-foreground'>
            {t('bank_account.description')}
          </p>
          <Separator className='bg-yellow-400 mt-4' />
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(form as z.infer<typeof bankSchema>)
        }}
        className='w-full flex flex-col gap-4 max-h-[725px] overflow-y-auto mx-4'
      >
        <div>
          <Label htmlFor='bank_name' className='text-sm font-semibold'>
            {t('bank_account.name.title')}
          </Label>
          <p className='text-xs text-muted-foreground'>
            {t('bank_account.name.description')}
          </p>
          {formErrors.bank_name && (
            <p className='text-red-500 text-xs'>{formErrors.bank_name}</p>
          )}
          <Input
            id='bank_name'
            name='bank_name'
            placeholder={t('bank_account.name.placeholder')}
            value={form.bank_name}
            onChange={(e) => {
              setForm({ ...form, bank_name: e.target.value })
            }}
          />
        </div>

        <div>
          <Label htmlFor='clearing_number' className='text-sm font-semibold'>
            {t('bank_account.clearing_number.title')}
          </Label>
          <p className='text-xs text-muted-foreground'>
            {t('bank_account.clearing_number.description')}
          </p>
          {formErrors.clearing_number && (
            <p className='text-red-500 text-xs'>{formErrors.clearing_number}</p>
          )}
          <Input
            id='clearing_number'
            name='clearing_number'
            placeholder={t('bank_account.clearing_number.placeholder')}
            value={form.clearing_number}
            onChange={(e) => {
              setForm({ ...form, clearing_number: e.target.value })
            }}
          />
        </div>

        <div>
          <Label htmlFor='account_number' className='text-sm font-semibold'>
            {t('bank_account.account_number.title')}
          </Label>
          <p className='text-xs text-muted-foreground'>
            {t('bank_account.account_number.description')}
          </p>
          {formErrors.account_number && (
            <p className='text-red-500 text-xs'>{formErrors.account_number}</p>
          )}
          <Input
            id='account_number'
            name='account_number'
            placeholder={t('bank_account.account_number.placeholder')}
            value={form.account_number}
            onChange={(e) => {
              setForm({ ...form, account_number: e.target.value })
            }}
          />
        </div>

        <Button type='submit'>Save Changes</Button>
      </form>
    </section>
  )
}
