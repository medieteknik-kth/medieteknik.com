'use client'
import { useTranslation } from '@/app/i18n/client'
import Loading from '@/components/tooltips/Loading'
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
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { API_BASE_URL } from '@/utility/Constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { z } from 'zod'

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then((res) => res.json())

interface Props {
  language: string
}

/**
 * @name LoginForm
 * @description The login form, used for logging in with an email and password
 *
 * @param {Props} props
 * @param {string} props.language - The language code
 * @returns {JSX.Element} The login form
 */
export default function LoginForm({ language }: Props): JSX.Element {
  const { t } = useTranslation(language, 'login')

  const {
    login,
    error: authError,
    isLoading: authLoading,
  } = useAuthentication()
  const [errorMessage, setErrorMessage] = useState(authError)
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/csrf-token`,
    fetcher
  )

  const FormSchema = z.object({
    email: z
      .string()
      .min(1, { message: 'Please enter your email address' })
      .email({ message: 'Please enter a valid email address' })
      .refine(
        (email) => {
          return email.includes('@kth.se')
        },
        {
          message: 'Please enter a valid student email address (@kth.se)',
        }
      ),
    password: z
      .string()
      .min(1, { message: 'Please enter your password' })
      .min(4, { message: 'Password must be at least 8 characters' }),

    csrf_token: z.string().optional().or(z.literal('')),
  })

  const loginForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      csrf_token: '',
    },
  })

  const { setValue } = loginForm

  if (error) {
    return (
      <div className='flex flex-col gap-0.5'>
        <p className='text-red-500 font-bold text-xl text-center'>
          {t('network_error')}
        </p>
        <p className='text-red-500 text-lg text-center'>{error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return <Loading language={language} />
  }

  const submit = async (formData: z.infer<typeof FormSchema>) => {
    const success = await login(
      formData.email,
      formData.password,
      formData.csrf_token || data.csrf_token
    )

    if (success) {
      window.location.href = `${window.location.origin}/${language}`
    } else {
      setErrorMessage(authError)
    }
  }

  return (
    <div className='w-full'>
      {errorMessage && (
        <p className='text-red-500 font-bold mb-2 text-xl text-center'>
          {errorMessage}
        </p>
      )}
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(submit)}>
          <FormField
            name='email'
            render={({ field }) => (
              <FormItem className='w-full mb-4'>
                <FormLabel className='text-xl'>{t('email')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('email')}
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
                <FormLabel className='text-xl'>{t('password')}</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder={t('password')}
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
              setValue('csrf_token', data.token)
            }}
          >
            {t('login')}
          </Button>
        </form>
      </Form>
    </div>
  )
}
