'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import {
  useAuthentication,
  useStudent,
} from '@/providers/AuthenticationProvider'
import { bankSchema } from '@/schemas/bank'
import { zodResolver } from '@hookform/resolvers/zod'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

interface Props {
  language: LanguageCode
  includeBanner?: boolean
}

export default function AccountPage({ language, includeBanner = true }: Props) {
  const { student, bank_account } = useStudent()
  const { setStale } = useAuthentication()
  const { t } = useTranslation(language, 'account')
  const bankInformationForm = useForm<z.infer<typeof bankSchema>>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bank_name: bank_account?.bank_name || '',
      clearing_number: bank_account?.clearing_number || '',
      account_number: bank_account?.account_number || '',
    },
  })

  const onSubmit = async (data: z.infer<typeof bankSchema>) => {
    if (!student) {
      toast({
        title: t('bank_account.error.title'),
        description: t('bank_account.notLoggedIn.description'),
        variant: 'destructive',
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
      toast({
        title: t('bank_account.success.title'),
        description: t('bank_account.success.description'),
        variant: 'default',
      })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: t('bank_account.error.title'),
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: t('bank_account.error.title'),
          description: t('bank_account.error.description'),
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <section className='w-full max-w-[1100px] flex flex-col mb-8 2xl:mb-0'>
      {includeBanner && (
        <div className='w-full mb-4 px-4 pt-4'>
          <h2 className='text-lg font-bold'>{t('bank_account.title')}</h2>
          <p className='text-sm text-muted-foreground'>
            {t('bank_account.description')}
          </p>
          <Separator className='bg-yellow-400 mt-4' />
        </div>
      )}
      <form
        onSubmit={bankInformationForm.handleSubmit(onSubmit)}
        className='w-full flex flex-col gap-4 max-h-[725px] overflow-y-auto'
      >
        <Form {...bankInformationForm}>
          <FormField
            name='bank_name'
            render={({ field }) => (
              <div className='px-4'>
                <FormLabel
                  htmlFor='bank_name'
                  className='text-sm font-semibold'
                >
                  {t('bank_account.name.title')}
                </FormLabel>
                <FormMessage />

                <p className='text-xs text-muted-foreground'>
                  {t('bank_account.name.description')}
                </p>
                <FormControl>
                  <Input
                    id='bank_name'
                    {...field}
                    placeholder={t('bank_account.name.placeholder')}
                  />
                </FormControl>
              </div>
            )}
          />

          <FormField
            name='clearing_number'
            render={({ field }) => (
              <div className='px-4'>
                <FormLabel
                  htmlFor='clearing_number'
                  className='text-sm font-semibold'
                >
                  {t('bank_account.clearing_number.title')}
                </FormLabel>
                <FormMessage />

                <p className='text-xs text-muted-foreground'>
                  {t('bank_account.clearing_number.description')}
                </p>
                <FormControl>
                  <Input
                    id='clearing_number'
                    {...field}
                    placeholder={t('bank_account.clearing_number.placeholder')}
                  />
                </FormControl>
              </div>
            )}
          />

          <FormField
            name='account_number'
            render={({ field }) => (
              <div className='px-4'>
                <FormLabel
                  htmlFor='account_number'
                  className='text-sm font-semibold'
                >
                  {t('bank_account.account_number.title')}
                </FormLabel>
                <FormMessage />

                <p className='text-xs text-muted-foreground'>
                  {t('bank_account.account_number.description')}
                </p>
                <FormControl>
                  <Input
                    id='account_number'
                    {...field}
                    placeholder={t('bank_account.account_number.placeholder')}
                  />
                </FormControl>
              </div>
            )}
          />

          <Button type='submit' className='mx-4'>
            Save Changes
          </Button>
        </Form>
      </form>
    </section>
  )
}
