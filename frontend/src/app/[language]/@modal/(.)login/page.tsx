'use client'

import AlternativeLogin from '@/app/[language]/login/client/alternative'
import LoginForm from '@/app/[language]/login/client/loginForm'
import { useTranslation } from '@/app/i18n/client'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import type { LanguageCode } from '@/models/Language'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useRouter, useSearchParams } from 'next/navigation'
import { use, useState } from 'react'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default function LoginModal(props: Props) {
  const { language } = use(props.params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation(language, 'login')
  const [remember, setRemember] = useState(
    window.localStorage.getItem('remember') === 'true' || false
  )

  const return_url = encodeURI(searchParams.get('return_url') || '')

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('login')}</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>Login</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div className='text-sm!'>
          <AlternativeLogin
            language={language}
            return_url={return_url}
            remember={remember}
          />
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
        <DialogFooter>
          <LoginForm language={language} remember={remember} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
