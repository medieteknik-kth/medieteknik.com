'use client'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { LanguageCode } from '@/models/Language'
import { useDocumentManagement } from '@/providers/DocumentProvider'
import { ClockIcon, HomeIcon } from '@heroicons/react/24/outline'

import type { JSX } from 'react'

interface Props {
  language: LanguageCode
}

/**
<<<<<<<< HEAD:frontend/src/app/[language]/chapter/documents/sidebar/client/sidebarStatus.tsx
 * @name SidebarStatus
========
 * @name StatusSelect
>>>>>>>> master:frontend/src/app/[language]/chapter/documents/toolbar/client/statusSelect.tsx
 * @description A component that displays a list of statuses for documents. Should only render on smaller screens.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.language - The current language of the application.
<<<<<<<< HEAD:frontend/src/app/[language]/chapter/documents/sidebar/client/sidebarStatus.tsx
 * @returns {JSX.Element} The JSX code for the SidebarStatus component.
 */
export default function SidebarStatus({ language }: Props): JSX.Element {
========
 * @returns {JSX.Element} The JSX code for the StatusSelect component.
 */
export default function StatusSelect({ language }: Props): JSX.Element {
>>>>>>>> master:frontend/src/app/[language]/chapter/documents/toolbar/client/statusSelect.tsx
  const { t } = useTranslation(language, 'document')
  const { status, setStatus } = useDocumentManagement()

  return (
<<<<<<<< HEAD:frontend/src/app/[language]/chapter/documents/sidebar/client/sidebarStatus.tsx
    <div className='flex flex-col gap-2'>
      <h2 className='text-lg font-semibold tracking-wide'>
        {t('categories.status')}
      </h2>

========
    <div className='flex gap-2'>
>>>>>>>> master:frontend/src/app/[language]/chapter/documents/toolbar/client/statusSelect.tsx
      <Button
        variant={status === 'active' ? 'secondary' : 'outline'}
        className='w-full !justify-start flex gap-2 items-center'
        title={t('category.time.active')}
        onClick={() => setStatus('active')}
      >
        <HomeIcon className='w-6 h-6' />
        <p>{t('category.time.active')}</p>
      </Button>
      <Button
        variant={status === 'archived' ? 'secondary' : 'outline'}
        className='w-full !justify-start flex gap-2 items-center'
        title={
          t('category.time.archive') + ' <' + (new Date().getFullYear() - 1)
        }
        onClick={() => setStatus('archived')}
      >
        <ClockIcon className='w-6 h-6' />
        <p>{t('category.time.archive')}</p>
      </Button>
    </div>
  )
}
