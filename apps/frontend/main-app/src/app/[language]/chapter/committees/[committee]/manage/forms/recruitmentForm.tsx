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
import { useState } from 'react'
import { z } from 'zod/v4-mini'

interface TranslateProps {
  index: number
  language: LanguageCode
  form: z.infer<typeof createRecruitmentSchema>
  setForm: React.Dispatch<
    React.SetStateAction<z.infer<typeof createRecruitmentSchema>>
  >
}

interface Props {
  language: LanguageCode
  onSuccess: () => void
}

function TranslatedInputs({ index, language, form, setForm }: TranslateProps) {
  const { t } = useTranslation(
    language,
    'committee_management/forms/recruitment'
  )
  return (
    <>
      <div>
        <Input type='hidden' value={language} />
      </div>

      <div>
        <Label
          htmlFor={`translations.${index}.title`}
          className='text-sm font-semibold'
        >
          {t('link_label')}{' '}
          <span className='uppercase text-xs tracking-wide'>
            [{LANGUAGES[language].name}]
          </span>
        </Label>
        <Input
          id={`translations.${index}.link`}
          name={`translations.${index}.link`}
          type='url'
          placeholder={t('link_placeholder')}
          value={form.translations[index].link}
          onChange={(e) =>
            setForm((prev) => {
              const newTranslations = [...prev.translations]
              newTranslations[index] = {
                ...newTranslations[index],
                link: e.target.value,
              }
              return { ...prev, translations: newTranslations }
            })
          }
        />
      </div>

      <div>
        <Label
          htmlFor={`translations.${index}.description`}
          className='text-sm font-semibold'
        >
          {t('description_label')}{' '}
          <span className='uppercase text-xs tracking-wide'>
            [{LANGUAGES[language].name}]
          </span>
        </Label>
        <Textarea
          id={`translations.${index}.description`}
          name={`translations.${index}.description`}
          placeholder={t('description_placeholder')}
          value={form.translations[index].description}
          onChange={(e) =>
            setForm((prev) => {
              const newTranslations = [...prev.translations]
              newTranslations[index] = {
                ...newTranslations[index],
                description: e.target.value,
              }
              return { ...prev, translations: newTranslations }
            })
          }
        />
      </div>
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
  const [form, setForm] = useState<z.infer<typeof createRecruitmentSchema>>({
    position: positions[0].translations[0].title,
    end_date: new Date(),
    translations: SUPPORTED_LANGUAGES.map((lang) => ({
      language_code: lang,
      link: '',
      description: '',
    })),
  })
  const [formErrors, setFormErrors] = useState({
    position: '',
    end_date: '',
    translations: SUPPORTED_LANGUAGES.reduce(
      (acc, lang) => {
        acc[lang] = { link: '', description: '' }
        return acc
      },
      {} as Record<LanguageCode, { link: string; description: string }>
    ),
  })

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

  const submit = async (data: z.infer<typeof createRecruitmentSchema>) => {
    const position = positions.find(
      (p) =>
        p.translations[0].title.toLowerCase() === data.position.toLowerCase()
    )
    if (!position) {
      setErrorMessage(t('error.position_not_found'))
      return
    }

    const errors = createRecruitmentSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)

      setFormErrors({
        position: fieldErrors.properties?.position?.errors[0] || '',
        end_date: fieldErrors.properties?.end_date?.errors[0] || '',
        translations:
          fieldErrors.properties?.translations?.items?.reduce(
            (acc, item, index) => {
              acc[SUPPORTED_LANGUAGES[index]] = {
                link: item.properties?.link?.errors[0] || '',
                description: item.properties?.description?.errors[0] || '',
              }
              return acc
            },
            {} as Record<LanguageCode, { link: string; description: string }>
          ) ||
          ({} as Record<LanguageCode, { link: string; description: string }>),
      })

      setErrorMessage(
        fieldErrors.properties?.translations?.errors[0] ||
          t('error.invalid_data')
      )
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
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(form)
          }}
          className='z-10'
        >
          <div>
            <Label className='text-sm font-semibold'>
              {t('position_label')}
            </Label>
            <Popover
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
              modal={popoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  aria-expanded={popoverOpen}
                  value={value}
                  className='w-72 justify-between'
                >
                  {form.position
                    ? dropdownOptions.find((p) => p.value === value)?.label
                    : t('position_placeholder')}
                  <ChevronDownIcon className='w-4 h-4 ml-2' />
                </Button>
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
                            setForm({
                              ...form,
                              position: option.value,
                            })
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
            {formErrors.position && (
              <div className='text-xs text-red-600'>{formErrors.position}</div>
            )}
          </div>

          <div>
            <Label className='text-sm font-semibold'>
              {t('end_date_label')}
            </Label>
            <Input
              type='datetime-local'
              value={form.end_date.toISOString().slice(0, 16)}
              onChange={(e) =>
                setForm({
                  ...form,
                  end_date: new Date(e.target.value),
                })
              }
            />
            {formErrors.end_date && (
              <div className='text-xs text-red-600'>{formErrors.end_date}</div>
            )}
          </div>

          {SUPPORTED_LANGUAGES.map((language, index) => (
            <TabsContent key={language} value={language}>
              <TranslatedInputs
                index={index}
                language={language}
                form={form}
                setForm={setForm}
              />
              {formErrors.translations[language] && (
                <div className='text-xs text-red-600 mt-2'>
                  <p>{formErrors.translations[language].link}</p>
                  <p>{formErrors.translations[language].description}</p>
                </div>
              )}
            </TabsContent>
          ))}

          <Button type='submit' className='w-full mt-4'>
            {t('submit_button')}
          </Button>
        </form>
      </Tabs>
    </DialogContent>
  )
}
