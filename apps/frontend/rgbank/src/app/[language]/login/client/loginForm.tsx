'use client'

import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loading from '@/components/ui/loading'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { loginSchema } from '@/schemas/authentication/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { AccordionItem } from '@radix-ui/react-accordion'
import { useRouter } from 'next/navigation'
import { type JSX, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import type { z } from 'zod'

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then((res) => res.json())

interface Props {
  language: LanguageCode
  remember?: boolean
}

/**
 * @name LoginForm
 * @description The login form, used for logging in with an email and password
 *
 * @param {Props} props
 * @param {string} props.language - The language code
 *
 * @returns {JSX.Element} The login form
 */
export default function LoginForm({ language, remember }: Props): JSX.Element {
  const { login, error: authError } = useAuthentication()
  const [errorMessage, setErrorMessage] = useState('')
  const { data, error, isLoading } = useSWR('/api/csrf-token', fetcher)
  const router = useRouter()

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      csrf_token: '',
      remember: false,
    },
  })

  if (error) {
    return (
      <div className='flex flex-col gap-0.5 w-full'>
        <p className='text-red-500 font-bold text-xl text-center'>
          {error.message}
        </p>
        <p className='text-red-500 text-lg text-center'>{error.error}</p>
      </div>
    )
  }

  const submit = async (formData: z.infer<typeof loginSchema>) => {
    const success = await login(
      formData.email,
      formData.password,
      formData.csrf_token || data.csrf_token,
      remember || false
    )

    if (success) {
      router.back()
    } else {
      if (authError) {
        setErrorMessage(authError)
      } else {
        setErrorMessage('Login error')
      }
    }
  }

  if (isLoading) {
    return (
      <div className='w-full h-20'>
        <Loading language={language} />
      </div>
    )
  }

  return (
    <div className='w-full'>
      {errorMessage && (
        <p className='text-red-500 font-bold mb-2 text-xl text-center'>
          {errorMessage}
        </p>
      )}
      <h2 className='w-full tracking-wide font-semibold border-t pt-2'>
        Alternative login methods
      </h2>
      <Accordion type='multiple'>
        <AccordionItem value='email'>
          <AccordionTrigger className='text-base'>
            Account login
          </AccordionTrigger>
          <AccordionContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(submit)}>
                <FormField
                  name='email'
                  render={({ field }) => (
                    <FormItem className='w-full mb-4'>
                      <FormLabel
                        style={{
                          fontSize: 'inherit',
                        }}
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={'test@kth.se'}
                          autoComplete='email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        style={{
                          fontSize: 'inherit',
                        }}
                      >
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder={'Password'}
                          autoComplete='current-password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name='csrf_token'
                  render={({ field }) => (
                    <FormItem>
                      <input type='hidden' {...field} />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='w-full mt-4'
                  onClick={() => {
                    loginForm.setValue('csrf_token', data.token)
                  }}
                >
                  Login
                </Button>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
