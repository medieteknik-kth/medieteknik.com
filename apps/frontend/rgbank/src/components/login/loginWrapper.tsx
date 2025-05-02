'use client'

import { useTranslation } from '@/app/i18n/client'
import AlternativeLogin from '@/components/login/alternative'
import LoginForm from '@/components/login/loginForm'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { LanguageCode } from '@/models/Language'
import { useEffect, useState } from 'react'

interface Props {
  language: LanguageCode
  onSuccess?: () => void
  onError?: () => void
}

export default function LoginWrapper({ language, onSuccess, onError }: Props) {
  const [remember, setRemember] = useState(false)
  const { t } = useTranslation(language, 'login')

  useEffect(() => {
    if (!window) return
    const storedRemember = window.localStorage.getItem('remember')
    setRemember(storedRemember === 'true')
  })

  return (
    <>
      <div className='w-11/12 h-fit xs:mx-20 xs:px-10 mt-8 text-lg'>
        <h1 className='text-3xl md:text-5xl uppercase font-bold tracking-wider text-[#111] dark:text-white text-center mb-8'>
          {t('title')}
        </h1>
        <AlternativeLogin language={language} />
        <div className='flex justify-center items-center gap-2'>
          <Checkbox
            id='remember_me'
            checked={remember}
            onCheckedChange={(checked) => {
              if (typeof checked === 'boolean') {
                window.localStorage.setItem('remember', checked.toString())
                setRemember(checked)
              }
            }}
          />
          <Label htmlFor='remember_me' className='flex items-center'>
            {t('rememberMe')}
          </Label>
        </div>
      </div>

      <div className='w-full text-lg mt-4'>
        <LoginForm
          language={language}
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </>
  )
}
