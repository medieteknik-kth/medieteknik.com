'use client'

import { useTranslation } from '@/app/i18n/client'
import { Label, Loading } from '@/components/ui'
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { loginSchema } from '@/schemas/authentication/login'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { AccordionItem } from '@radix-ui/react-accordion'
import { z } from '@zod/mini'
import { useRouter, useSearchParams } from 'next/navigation'
import { type JSX, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then((res) => res.json())

interface Props {
  language: LanguageCode
  remember?: boolean
  onSuccess?: () => void
  onError?: () => void
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
export default function LoginForm({
  language,
  remember,
  onSuccess,
  onError,
}: Props): JSX.Element {
  const { login, error: authError, setStale } = useAuthentication()
  const [errorMessage, setErrorMessage] = useState('')
  const { data, error, isLoading } = useSWR('/api/csrf-token', fetcher)
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('return_url')
  const { t } = useTranslation(language, 'login')
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
    csrf_token: '',
  })
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
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
    if (!data) {
      setErrorMessage('No CSRF token found')
      return
    }

    const errors = loginSchema.safeParse(formData)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        email: fieldErrors.properties?.email?.errors[0] || '',
        password: fieldErrors.properties?.password?.errors[0] || '',
      })
      setErrorMessage('Invalid form data')
      return
    }

    const success = await login(
      formData.email,
      formData.password,
      formData.csrf_token || data.csrf_token,
      remember || false
    )

    if (success) {
      setStale(true)

      if (returnUrl) {
        router.push(returnUrl)

        if (onSuccess) {
          onSuccess()
        }
      } else {
        if (onSuccess) {
          onSuccess()
        } else {
          router.back()
        }
      }
    } else {
      if (authError) {
        setErrorMessage(authError)
      } else {
        setErrorMessage('Login error')
      }

      if (onError) {
        onError()
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
        {t('alternativeLogin')}
      </h2>
      <Accordion type='multiple'>
        <AccordionItem value='email'>
          <AccordionTrigger className='accordion-login text-base'>
            {t('accountLogin')}
          </AccordionTrigger>
          <AccordionContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit(form as z.infer<typeof loginSchema>)
              }}
            >
              <div>
                <Label htmlFor='email' className='text-sm font-semibold'>
                  {t('email')}
                </Label>
                {formErrors.email && (
                  <p className='text-red-500 text-xs'>{formErrors.email}</p>
                )}
                <Input
                  id='email'
                  name='email'
                  placeholder={'test@kth.se'}
                  autoComplete='email'
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value })
                  }}
                />
              </div>

              <div>
                <Label htmlFor='password' className='text-sm font-semibold'>
                  {t('password')}
                </Label>
                {formErrors.password && (
                  <p className='text-red-500 text-xs'>{formErrors.password}</p>
                )}
                <Input
                  id='password'
                  name='password'
                  type='password'
                  placeholder={'Password'}
                  autoComplete='current-password'
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value })
                  }}
                />
              </div>

              <input id='csrf_token' name='csrf_token' type='hidden' />
              <Button
                id='login-button'
                type='submit'
                title={t('login')}
                className='w-full mt-4'
                onClick={() => {
                  setForm({
                    ...form,
                    remember: remember ? remember : false,
                    csrf_token: data.token,
                  })
                }}
              >
                {t('login')}
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
