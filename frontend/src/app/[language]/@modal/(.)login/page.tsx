'use client'

import AlternativeLogin from '@/app/[language]/login/client/alternative'
import LoginForm from '@/app/[language]/login/client/loginForm'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  language: string
}

export default function LoginModal({ language }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation(language, 'login')

  const return_url = encodeURI(searchParams.get('return_url') || '')

  return (
    <div className='fixed w-full h-full flex items-center justify-center top-0 left-0 z-[60]'>
      <div
        className='absolute bg-black/30 z-10 w-full h-full left-0 top-0'
        onClick={() => {
          router.back()
        }}
      />
      <div className='w-full md:w-[500px] rounded-lg border bg-card text-card-foreground shadow-sm z-20 relative'>
        <h1 className='text-2xl font-semibold leading-none tracking-tight p-6'>
          {t('login')}
        </h1>
        <Button
          className='absolute right-4 top-4'
          size={'icon'}
          variant={'ghost'}
          onClick={() => {
            router.back()
          }}
        >
          <XMarkIcon className='w-6 h-6' />
        </Button>
        <div className='p-6 pt-0'>
          <LoginForm language={language} />
        </div>
        <div className='flex items-center p-6 pt-0'>
          <AlternativeLogin language={language} return_url={return_url} />
        </div>
      </div>
    </div>
  )
}
