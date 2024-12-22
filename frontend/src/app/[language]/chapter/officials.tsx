'use client'

import OfficialsList from '@/app/[language]/chapter/officialsList'
import { useTranslation } from '@/app/i18n/client'
import Loading from '@/components/tooltips/Loading'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { LanguageCode } from '@/models/Language'
import type { StudentCommitteePosition } from '@/models/Student'
import { API_BASE_URL } from '@/utility/Constants'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { useState, useTransition } from 'react'

interface Props {
  language: LanguageCode
  currentMembers: StudentCommitteePosition[]
}

export default function Officials({ language, currentMembers }: Props) {
  const { t } = useTranslation(language, 'chapter')
  const [open, setOpen] = useState(false)
  const [members, setMembers] = useState(currentMembers)
  const [isPending, startTransition] = useTransition()

  const years = [
    {
      value: '2024-2025',
      label: '2024 - 2025',
    },
    {
      value: '2023-2024',
      label: '2023 - 2024',
    },
    {
      value: '2022-2023',
      label: '2022 - 2023',
    },
    {
      value: '2021-2022',
      label: '2021 - 2022',
    },
    {
      value: '2020-2021',
      label: '2020 - 2021',
    },
    {
      value: '2019-2020',
      label: '2019 - 2020',
    },
    {
      value: '2018-2019',
      label: '2018 - 2019',
    },
  ]

  const [value, setValue] = useState(years[0].value)

  const onYearChange = (year: string, currentValue: string) => {
    const previousMembers = [...members]
    setMembers([])
    startTransition(async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/public/students/committee_members?language=${language}&date=${year}`,
          {
            next: {
              revalidate: 0,
            },
          }
        )

        setOpen(false)

        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }

        const data = await response.json()

        setValue(currentValue === value ? '' : currentValue)
        setMembers(data)
      } catch (error) {
        console.error(error)
        setMembers(previousMembers)
      }
    })
  }

  return (
    <section id='officials' className='px-2 sm:px-5 md:px-12 mb-10'>
      <div className='w-full lg:w-1/2 flex flex-col md:flex-row items-center gap-4 pb-4'>
        <h1 className='uppercase tracking-wider font-semibold text-2xl sm:text-4xl block'>
          {t('officials')}
        </h1>
        <Label className='uppercase'>{t('year')}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
              role='combobox'
              aria-expanded={open}
              className='w-[200px] justify-between'
              disabled={isPending}
            >
              {value
                ? years.find((year) => year.value === value)?.label
                : t('select_year')}

              {open ? (
                <ChevronUpIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              ) : (
                <ChevronDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandInput placeholder={t('search_year')} />
              <CommandList>
                <CommandEmpty>{t('no_results')}</CommandEmpty>
                <CommandGroup>
                  {years.map((year) => (
                    <CommandItem
                      key={year.value}
                      value={year.value}
                      onSelect={(currentValue) =>
                        onYearChange(year.value, currentValue)
                      }
                    >
                      {year.label}
                      <CheckIcon
                        className={`${
                          year.value === value ? 'opacity-100' : 'opacity-0'
                        } w-4 h-4 ml-auto`}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {!isPending ? (
        <OfficialsList language={language} year={value} members={members} />
      ) : (
        <Loading language={language} />
      )}
    </section>
  )
}
