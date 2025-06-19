'use client'

import AlternativeLogin from '@/app/[language]/login/client/alternative'
import LoginForm from '@/app/[language]/login/client/loginForm'
import { useTranslation } from '@/app/i18n/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { LanguageCode } from '@/models/Language'
import { useState } from 'react'

interface Props {
  language: LanguageCode
}

export default function LoginWrapper({ language }: Props) {
  const { t } = useTranslation(language, 'login')
  const [remember, setRemember] = useState(
    window.localStorage.getItem('remember') === 'true' || false
  )

  return (
    <>
      <div className='w-11/12 h-fit xs:mx-20 xs:px-10 mt-8 text-lg'>
        <h1 className='text-3xl md:text-5xl uppercase font-bold tracking-wider text-[#111] dark:text-white text-center mb-8'>
          {t('login')}
        </h1>
        <AlternativeLogin language={language} remember={remember} />
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
            {t('remember_me')}
          </Label>
        </div>
      </div>

      <div className='w-full text-lg mt-4'>
        <LoginForm language={language} />
      </div>
    </>
  )
}
