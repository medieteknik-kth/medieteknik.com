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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { LanguageCode } from '@/models/Language'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { type JSX, useState } from 'react'

interface Props {
  language: LanguageCode
  setValue: (value: string) => void
}

/**
 * @name RepeatingForm
 * @description Form items for repeating events
 *
 * @param {Props} props - The props for the component
 * @param {string} props.language - The language of the component
 * @param {(value: string) => void} props.setValue - The function to set the value
 * @returns {JSX.Element} The repeating form
 */
export default function RepeatingForm({
  language,
  setValue,
}: Props): JSX.Element {
  const { t } = useTranslation(language, 'bulletin')
  const [open, setOpen] = useState(false)

  const frequencyOptions = [
    {
      value: 'DAILY',
      label: t('event.form.daily'),
    },
    {
      value: 'WEEKLY',
      label: t('event.form.weekly'),
    },
    {
      value: 'MONTHLY',
      label: t('event.form.monthly'),
    },
    {
      value: 'YEARLY',
      label: t('event.form.yearly'),
    },
  ]
  return (
    <div className='grid grid-cols-2 gap-2 mt-2 *:h-16'>
      <FormField
        name='frequency'
        render={({ field }) => (
          <FormItem className='col-span-1 flex flex-col justify-between items-start'>
            <FormLabel className='flex items-center'>
              <p>{t('event.form.frequency')}</p>
              <sup className='text-red-600 px-0.5 select-none'>*</sup>
            </FormLabel>
            <Popover open={open} onOpenChange={setOpen} modal={open}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                    role='combobox'
                    type='button'
                    aria-expanded={open}
                    className='w-[200px] text-left'
                  >
                    {field.value || t('event.form.frequency')}
                    <ChevronUpDownIcon className='w-5 h-5 ml-2' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput placeholder='Select Frequency' />
                  <CommandList>
                    <CommandEmpty />
                    <CommandGroup>
                      {frequencyOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(value) => {
                            setValue(value)
                            setOpen(false)
                          }}
                        >
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name='end_date'
        render={({ field }) => (
          <FormItem className='col-span-1 flex flex-col justify-between'>
            <FormLabel>{t('event.form.end_date')}</FormLabel>
            <FormControl>
              <Input id='end_date' type='date' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name='max_occurrences'
        render={({ field }) => (
          <FormItem className='col-span-1 flex flex-col justify-between'>
            <FormLabel>{t('event.form.max_occurrences')}</FormLabel>
            <FormControl>
              <Input id='max_occurrences' type='number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
