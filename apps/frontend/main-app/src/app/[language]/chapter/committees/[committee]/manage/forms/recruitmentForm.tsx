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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { createRecruitmentSchema } from '@/schemas/committee/recruitment'
import { LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

interface TranslateProps {
  index: number
  language: LanguageCode
}

interface Props {
  language: LanguageCode
  onSuccess: () => void
}

function TranslatedInputs({ index, language }: TranslateProps) {
  const { t } = useTranslation(
    language,
    'committee_management/forms/recruitment'
  )
  return (
    <>
      <FormField
        name={`translations.${index}.language_code`}
        render={({ field }) => (
          <FormItem>
            <Input {...field} type='hidden' />
          </FormItem>
        )}
      />

      <FormField
        name={`translations.${index}.link`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('link_label')}{' '}
              <span className='uppercase text-xs tracking-wide'>
                [{LANGUAGES[language].name}]
              </span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type='url'
                placeholder={t('link_placeholder')}
              />
            </FormControl>
            <FormDescription>{t('link_description')}</FormDescription>
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />

      <FormField
        name={`translations.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('description_label')}{' '}
              <span className='uppercase text-xs tracking-wide'>
                [{LANGUAGES[language].name}]
              </span>
            </FormLabel>
            <FormControl>
              <Textarea {...field} placeholder={t('description_placeholder')} />
            </FormControl>
            <FormDescription>{t('description_description')}</FormDescription>
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />
    </>
  )
}

export default function RecruitmentForm({ language, onSuccess }: Props) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { positions } = useCommitteeManagement()
  const { positions: studentPositions } = useStudent()
  const [errorMessage, setErrorMessage] = useState('')
  const [value, setValue] = useState(positions[0].translations[0].title)
  const { t } = useTranslation(
    language,
    'committee_management/forms/recruitment'
  )

  const dropdownOptions = positions
    .filter((position) => {
      if (!studentPositions) return false
      if (studentPositions.length === 0) return true

      // Find students highest position (position with highest weight)
      const studentHighestPosition = studentPositions.reduce((prev, current) =>
        prev.weight > current.weight ? prev : current
      )

      // Remove positions with higher weight than the student's highest position
      return position.weight > studentHighestPosition.weight
    })
    .sort((a, b) => a.weight - b.weight)
    .map((position) => ({
      value: position.translations[0].title,
      label: position.translations[0].title
        .split('_')
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' '),
    }))

  const form = useForm<z.infer<typeof createRecruitmentSchema>>({
    resolver: zodResolver(createRecruitmentSchema),
    defaultValues: {
      position: 'MEMBER',
      end_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      translations: SUPPORTED_LANGUAGES.map((language) => ({
        language_code: language,
        link: '',
        description: '',
      })),
    },
  })

  const publish = async (data: z.infer<typeof createRecruitmentSchema>) => {
    const position = positions.find(
      (p) =>
        p.translations[0].title.toLowerCase() === data.position.toLowerCase()
    )
    if (!position) {
      setErrorMessage(t('error.position_not_found'))
      return
    }

    const response = await fetch(
      `/api/committee_positions/${position.committee_position_id}/recruit`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          start_date: new Date().toISOString(),
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      setErrorMessage(errorData.message)
      return
    }

    onSuccess()
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('title')}</DialogTitle>
        <DialogDescription>{t('description')}</DialogDescription>
      </DialogHeader>
      <Tabs defaultValue={language}>
        <Label>{t('language_label')}</Label>
        <TabsList className='overflow-x-auto w-full justify-start'>
          {SUPPORTED_LANGUAGES.map((language) => (
            <TabsTrigger
              key={language}
              value={language}
              className='w-fit'
              title={LANGUAGES[language].name}
            >
              <span className='w-6 h-6'>
                {LANGUAGES[language as LanguageCode].flag_icon}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {errorMessage && (
          <div className='w-full p-4 mt-2 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800'>
            {errorMessage}
          </div>
        )}
        <form onSubmit={form.handleSubmit(publish)} className='z-10'>
          <Form {...form}>
            <FormField
              control={form.control}
              name='position'
              render={({ field }) => (
                <FormItem className='flex flex-col my-2'>
                  <FormLabel>{t('position_label')}</FormLabel>
                  <Popover
                    open={popoverOpen}
                    onOpenChange={setPopoverOpen}
                    modal={popoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          aria-expanded={popoverOpen}
                          value={value}
                          className='w-72 justify-between'
                        >
                          {field.value
                            ? dropdownOptions.find((p) => p.value === value)
                                ?.label
                            : t('position_placeholder')}
                          <ChevronDownIcon className='w-4 h-4 ml-2' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandInput
                          placeholder={t('position_search_placeholder')}
                        />
                        <CommandList>
                          <CommandEmpty>{t('position_not_found')}</CommandEmpty>
                          <CommandGroup>
                            {dropdownOptions.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={() => {
                                  form.setValue('position', option.value)
                                  setValue(option.value)
                                  setPopoverOpen(false)
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
                  <FormMessage className='text-xs font-bold' />
                </FormItem>
              )}
            />

            <FormField
              name='end_date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('end_date_label')}</FormLabel>
                  <FormControl>
                    <Input {...field} type='datetime-local' />
                  </FormControl>
                  <FormMessage className='text-xs font-bold' />
                </FormItem>
              )}
            />

            {SUPPORTED_LANGUAGES.map((language, index) => (
              <TabsContent key={language} value={language}>
                <TranslatedInputs index={index} language={language} />
              </TabsContent>
            ))}

            <Button type='submit' className='w-full mt-4'>
              {t('submit_button')}
            </Button>
          </Form>
        </form>
      </Tabs>
    </DialogContent>
  )
}
