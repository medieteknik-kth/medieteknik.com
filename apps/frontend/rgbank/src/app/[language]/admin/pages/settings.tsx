'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import type Committee from '@/models/Committee'
import type { ExpenseDomain } from '@/models/ExpenseDomain'
import type { LanguageCode } from '@/models/Language'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState } from 'react'
import useSWR from 'swr'

interface Props {
  language: LanguageCode
  committees?: Committee[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SettingsPage({ language, committees }: Props) {
  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [newDomain, setNewDomain] = useState<string>('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [parts, setParts] = useState<{ value: string; id: number }[]>([])
  const [newTitle, setNewTitle] = useState<string>('')
  const [totalParts, setTotalParts] = useState(100)
  const { data: expenseDomains, error } = useSWR<ExpenseDomain[]>(
    '/api/public/rgbank/expense-domains',
    fetcher,
    {
      fallbackData: [],
    }
  )
  const { t } = useTranslation(language, 'admin/settings')
  const { t: errors } = useTranslation(language, 'errors')

  if (error || !expenseDomains) {
    return (
      <div className='container min-h-screen flex flex-col items-center justify-center gap-4'>
        <h1 className='text-3xl font-bold'>
          {errors('settings.failed.title')}
        </h1>
        <p className='text-muted-foreground'>
          {errors('settings.failed.description')}
        </p>
      </div>
    )
  }

  if (!committees) {
    return null
  }

  const allDomains = expenseDomains.map((domain) => {
    return {
      label: domain.title,
      value: domain.expense_part_id,
      icon: committees.find(
        (committee) => committee.committee_id === domain.committee_id
      )?.logo_url,
    }
  })

  const onNewDomainSubmit = async () => {
    if ((newDomain === '' && selectedDomain === '') || parts.length === 0) {
      return
    }

    const domainId = expenseDomains.find(
      (domain) => domain.title === selectedDomain
    )?.expense_part_id

    const title =
      newTitle ||
      newDomain ||
      expenseDomains.find((domain) => domain.title === selectedDomain)?.title ||
      ''

    const newDomainData = {
      title: title,
      parts: parts.map((part) => part.value),
    }

    try {
      const response = await fetch(
        `/api/rgbank/expense-domains${domainId ? `/${domainId}` : ''}`,
        {
          method: domainId ? 'PUT' : 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDomainData),
        }
      )

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      toast({
        title: t('domains.parts.success.title'),
        description: t('domains.parts.success.description'),
      })
    } catch (error) {
      console.error(
        t('domains.parts.error', {
          error: (error as Error).message,
        })
      )
    }
  }

  return (
    <section className='w-full h-fit max-w-[1100px] mb-8 2xl:mb-0'>
      <div className='-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>{t('title')}</h2>
        <p className='text-sm text-muted-foreground'>{t('description')}</p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>

      <div className='px-4'>
        <h3 className='text-sm font-semibold'>{t('domains.title')}</h3>

        <div className='grid grid-cols-2 grid-rows-[auto_auto] gap-4'>
          <p className='text-xs text-muted-foreground'>
            {t('domains.description')}
          </p>
          <p className='text-xs text-muted-foreground'>{t('domains.new')}</p>
          <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                role='combobox'
                className='min-w-96 items-center justify-between'
              >
                <div className='flex items-center gap-2'>
                  {allDomains.find((domain) => domain.label === selectedDomain)
                    ?.icon && (
                    <div className='bg-white p-1 rounded-lg'>
                      <Image
                        src={
                          allDomains.find(
                            (domain) => domain.label === selectedDomain
                          )?.icon || ''
                        }
                        alt=''
                        unoptimized
                        width={24}
                        height={24}
                      />
                    </div>
                  )}
                  {allDomains.find((domain) => domain.label === selectedDomain)
                    ?.label || t('domains.parts.select')}
                </div>
                <ChevronDownIcon className='w-5 h-5' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-96! p-0'>
              <Command>
                <CommandInput placeholder={t('domains.parts.search')} />
                <CommandList>
                  <CommandEmpty>{t('domains.parts.notFound')}</CommandEmpty>
                  <CommandGroup>
                    {allDomains.map((domain) => (
                      <CommandItem
                        key={domain.value}
                        value={domain.label}
                        onSelect={(currentValue) => {
                          setSelectedDomain(currentValue)
                          setDropdownOpen(false)
                          setParts(
                            expenseDomains
                              .find((domain) => domain.title === currentValue)
                              ?.parts.map((part, index) => ({
                                value: part,
                                id: index,
                              })) || []
                          )
                        }}
                        className='flex items-center gap-2 h-11 cursor-pointer'
                      >
                        {domain.icon && (
                          <div className='bg-white p-1 rounded-lg'>
                            <Image
                              src={domain.icon}
                              alt=''
                              unoptimized
                              width={24}
                              height={24}
                            />
                          </div>
                        )}
                        <div className='flex items-center gap-2'>
                          {domain.label}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Input
            onChange={(e) => {
              if (selectedDomain !== '') {
                setSelectedDomain('')
              }
              setNewDomain(e.target.value)
            }}
          />
        </div>
      </div>

      {selectedDomain && (
        <div className='px-4 mt-4'>
          <h3 className='text-sm font-semibold'>{t('domains.new.title')}</h3>
          <p className='text-xs text-muted-foreground'>
            {t('domains.new.description')}
          </p>
          <Input
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value)
            }}
            placeholder={t('domains.new.placeholder')}
            className='w-full'
          />
        </div>
      )}

      <div className='px-4 mt-4'>
        <h3 className='text-sm font-semibold'>{t('domains.parts.title')}</h3>
        <p className='text-xs text-muted-foreground'>
          {t('domains.parts.description')}
        </p>

        {(selectedDomain !== '' || newDomain !== '') && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onNewDomainSubmit()
            }}
            className='flex flex-col gap-2'
          >
            {parts.map((part) => (
              <div key={part.id} className='max-w-96 flex items-center gap-2'>
                <Input
                  value={part.value}
                  onChange={(e) => {
                    setParts((prev) =>
                      prev.map((p) =>
                        p.id === part.id ? { ...p, value: e.target.value } : p
                      )
                    )
                  }}
                  placeholder='Enter new part name'
                  className='w-full'
                />
                <Button
                  type='button'
                  variant='destructive'
                  disabled={parts.length < 2}
                  onClick={() => {
                    setParts((prev) => prev.filter((p) => p.id !== part.id))
                  }}
                >
                  {t('domains.parts.remove')}
                </Button>
              </div>
            ))}

            <Button
              type='button'
              variant={'outline'}
              disabled={
                parts.length > 1 && parts[parts.length - 1].value === ''
              }
              onClick={() => {
                setTotalParts((prev) => prev + 1)
                setParts((prev) => [...prev, { value: '', id: totalParts }])
              }}
            >
              {t('domains.parts.new')}
            </Button>
            <Button type='submit'>{t('domains.parts.save')}</Button>
          </form>
        )}
      </div>
    </section>
  )
}
