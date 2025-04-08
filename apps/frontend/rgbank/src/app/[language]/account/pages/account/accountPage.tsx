'use client'

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
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import { bankSchema } from '@/schemas/bank'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

interface Props {
  language: LanguageCode
}

function getMainDomain(): string {
  let hostname = window.location.hostname

  if (hostname.includes('localhost')) {
    hostname = 'localhost.com'
  }

  // Split the hostname by dots and get the last two parts
  const parts = hostname.split('.')

  if (parts.length >= 2) {
    // Take the last two parts to get the main domain
    return parts.slice(-2).join('.')
  }

  return hostname // Fallback to the full hostname
}

export default function AccountPage({ language }: Props) {
  const { student } = useStudent()
  const bankInformationForm = useForm<z.infer<typeof bankSchema>>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bank_name: '',
      sorting_number: '',
      account_number: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof bankSchema>) => {
    if (!student) {
      toast({
        title: 'Error saving bank information',
        description: 'You must be logged in to save bank information.',
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
        throw new Error('Failed to save bank information')
      }

      toast({
        title: 'Bank information saved',
        description: 'Your bank information has been saved successfully.',
        variant: 'default',
      })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error saving bank information',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Error saving bank information',
          description: 'An unknown error occurred.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <section className='w-full max-w-[1100px] flex flex-col mb-8 2xl:mb-0'>
      <div className='w-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>Account</h2>
        <p className='text-sm text-muted-foreground'>
          Accounts relevant to this app, you can manage the rest of your account
          in the{' '}
          <a
            href={`https://${getMainDomain()}/${language}/account`} // TODO: Add link to main app settings
            className='text-primary underline hover:text-primary/90'
          >
            main app settings
          </a>
          .
        </p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>
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
                  Bank Name
                </FormLabel>
                <FormMessage />

                <p className='text-xs text-muted-foreground'>
                  Bank name is the name of the bank associated with your
                  account.
                </p>
                <FormControl>
                  <Input id='bank_name' {...field} />
                </FormControl>
              </div>
            )}
          />

          <FormField
            name='sorting_number'
            render={({ field }) => (
              <div className='px-4'>
                <FormLabel
                  htmlFor='sorting_number'
                  className='text-sm font-semibold'
                >
                  Sorting Number
                </FormLabel>
                <FormMessage />

                <p className='text-xs text-muted-foreground'>
                  Sorting number is a unique identifier for your bank account.
                  It is used to identify the bank associated with your account.
                </p>
                <FormControl>
                  <Input id='sorting_number' {...field} />
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
                  Account Number
                </FormLabel>
                <FormMessage />

                <p className='text-xs text-muted-foreground'>
                  Account number is an identifier for your bank account. It is
                  used to identify who owns the account and who should the money
                  be sent to.
                </p>
                <FormControl>
                  <Input id='account_number' {...field} />
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
