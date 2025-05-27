'use client'

import { useTranslation } from '@/app/i18n/client'
import Loading from '@/components/tooltips/Loading'
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { loginSchema } from '@/schemas/authentication/login'
import { AccordionItem } from '@radix-ui/react-accordion'
import { useRouter } from 'next/navigation'
import { type JSX, useState } from 'react'
import useSWR from 'swr'
import { z } from 'zod/v4-mini'

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
  const { t } = useTranslation(language, 'login')

  const { login, error: authError } = useAuthentication()
  const [errorMessage, setErrorMessage] = useState('')
  const { data, error, isLoading } = useSWR('/api/csrf-token', fetcher)
  const router = useRouter()
  const [form, setForm] = useState<z.infer<typeof loginSchema>>({
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
          {t('network_error')}
        </p>
        <p className='text-red-500 text-lg text-center'>{t('network_error')}</p>
      </div>
    )
  }

  const submit = async (formData: z.infer<typeof loginSchema>) => {
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
      router.back()
    } else {
      if (authError) {
        setErrorMessage(authError)
      } else {
        setErrorMessage(t('login_failed'))
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
        {t('alternative_logins')}
      </h2>
      <Accordion type='multiple'>
        <AccordionItem value='email'>
          <AccordionTrigger className='text-base'>
            {t('alternative_logins.email')}
          </AccordionTrigger>
          <AccordionContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit(form)
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
