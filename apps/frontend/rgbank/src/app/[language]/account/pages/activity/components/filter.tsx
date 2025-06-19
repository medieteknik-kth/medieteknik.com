'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { availableStatuses } from '@/models/General'
import { FunnelIcon } from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import type { SetStateAction } from 'react'

interface Props {
  language: LanguageCode
  setFilters: (value: SetStateAction<string[]>) => void
  filters: string[]
}

export default function ActivityFilters({
  language,
  setFilters,
  filters,
}: Props) {
  const { t } = useTranslation(language, 'activities')

  return (
    <div className='flex flex-col gap-4 mb-2'>
      <div className='space-y-2 overflow-hidden'>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'} className='space-x-2'>
              <FunnelIcon className='h-4 w-4' />
              <p>{t('activity.filter.title')}</p>
              {Math.abs(6 - filters.length) > 0 && (
                <span className='text-xs text-muted-foreground'>
                  {Math.abs(6 - filters.length)}
                  {filters.length < 5 ? ' filters' : ' filter'}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className='flex flex-col gap-2'>
              <div className='text-sm text-muted-foreground'>
                {t('activity.filter.description')}
              </div>
              <div className='grid grid-cols-2 gap-2'>
                {availableStatuses.map((status) => (
                  <Button
                    key={status.value}
                    variant={'outline'}
                    size='sm'
                    className={`${
                      !filters.includes(status.value) ? 'grayscale-100' : ''
                    }`}
                    onClick={() => {
                      setFilters((prev) =>
                        prev.includes(status.value)
                          ? prev.filter((s) => s !== status.value)
                          : [...prev, status.value]
                      )
                    }}
                  >
                    <ExpenseStatusBadge
                      language={language}
                      status={status.value}
                    />
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
