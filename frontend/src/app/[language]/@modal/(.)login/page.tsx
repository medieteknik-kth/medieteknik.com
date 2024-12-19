'use client'

import AlternativeLogin from '@/app/[language]/login/client/alternative'
import LoginForm from '@/app/[language]/login/client/loginForm'
import { useTranslation } from '@/app/i18n/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { LanguageCode } from '@/models/Language'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useRouter, useSearchParams } from 'next/navigation'
import { use } from 'react'

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

        <div className='!text-sm'>
          <AlternativeLogin language={language} return_url={return_url} />
        </div>
        <DialogFooter>
          <LoginForm language={language} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
