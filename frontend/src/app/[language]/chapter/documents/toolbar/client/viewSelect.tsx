'use client';
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useDocumentManagement } from '@/providers/DocumentProvider'
import { Bars3Icon, Squares2X2Icon } from '@heroicons/react/24/outline'

import type { JSX } from "react";

interface Props {
  language: string
}

/**
 * @name ViewSelect
 * @description A component that displays a view selector for documents. Should only render on smaller screens.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.language - The current language of the application.
 * @returns {JSX.Element} The JSX code for the ViewSelect component.
 */
export default function ViewSelect({ language }: Props): JSX.Element {
  const { view, setView } = useDocumentManagement()

  const { t } = useTranslation(language, 'document')

  return (
    <div className='w-fit rounded-md border flex items-center gap-1'>
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size='icon'
        title={t('view.grid')}
        onClick={() => {
          if (view === 'grid') return
          setView('grid')
        }}
      >
        <Squares2X2Icon className='w-6 h-6' />
      </Button>
      <Separator orientation='vertical' className='h-6' />
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size='icon'
        title={t('view.list')}
        onClick={() => {
          if (view === 'list') return
          setView('list')
        }}
      >
        <Bars3Icon className='w-6 h-6' />
      </Button>
    </div>
  )
}
