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
import type Committee from '@/models/Committee'
import type {
  CommitteePosition,
  CommitteePositionCategory,
} from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { Role } from '@/models/Permission'
import { useStudent } from '@/providers/AuthenticationProvider'
import { addPositionSchema } from '@/schemas/committee/position'
import { LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { z } from 'zod/v4-mini'

interface TranslatedInputsProps {
  index: number
  language: LanguageCode
  form: z.infer<typeof addPositionSchema>
  setForm: React.Dispatch<
    React.SetStateAction<z.infer<typeof addPositionSchema>>
  >
}

function TranslatedInputs({
  index,
  language,
  form,
  setForm,
}: TranslatedInputsProps) {
  const { t } = useTranslation(language, 'committee_management/forms/position')

  return (
    <>
      <div>
        <Input id={`${language}_${index}`} type='hidden' value={language} />
      </div>

      <div>
        <Label className='text-sm font-semibold'>
          {t('title_label')}{' '}
          <span className='uppercase text-xs tracking-wide'>
            [{LANGUAGES[language].name}]
          </span>
        </Label>
        <Input
          id={`translations.${index}.title`}
          placeholder={t('title_placeholder')}
          value={form.translations[index].title}
          onChange={(e) => {
            const newTranslations = [...form.translations]
            newTranslations[index].title = e.target.value
            setForm({ ...form, translations: newTranslations })
          }}
        />
      </div>

      <div>
        <Label className='text-sm font-semibold'>
          {t('description_label')}{' '}
          <span className='uppercase text-xs tracking-wide'>
            [{LANGUAGES[language].name}]
          </span>
        </Label>
        <Input
          id={`translations.${index}.description`}
          value={form.translations[index].description}
          onChange={(e) => {
            const newTranslations = [...form.translations]
            newTranslations[index].description = e.target.value
            setForm({ ...form, translations: newTranslations })
          }}
        />
        <p className='text-xs text-muted-foreground mb-2'>
          {t('description_description')}
        </p>
      </div>
    </>
  )
}

export default function PositionForm({
  language,
  committee,
  onSuccess,
}: {
  language: LanguageCode
  committee: Committee
  onSuccess: (position: CommitteePosition) => void
}) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [value, setValue] = useState('NONE')
  const { role } = useStudent()
  const { t } = useTranslation(language, 'committee_management/forms/position')
  const [form, setForm] = useState<z.infer<typeof addPositionSchema>>({
    email: '',
    weight: 1000,
    category: 'NONE',
    translations: SUPPORTED_LANGUAGES.map((lang) => ({
      language_code: lang,
      title: '',
      description: '',
    })),
  })
  const [formErrors, setFormErrors] = useState({
    email: '',
    translations: SUPPORTED_LANGUAGES.reduce(
      (acc, lang) => {
        acc[lang] = { title: '', description: '' }
        return acc
      },
      {} as Record<string, { title: string; description: string }>
    ),
    category: '',
    weight: '',
  })

  const submit = async (data: z.infer<typeof addPositionSchema>) => {
    const errors = addPositionSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        email: fieldErrors.properties?.email?.errors[0] || '',
        translations:
          fieldErrors.properties?.translations?.items?.reduce(
            (acc, item, index) => {
              acc[SUPPORTED_LANGUAGES[index]] = {
                title: item.properties?.title?.errors[0] || '',
                description: item.properties?.description?.errors[0] || '',
              }
              return acc
            },
            {} as Record<LanguageCode, { title: string; description: string }>
          ) || {},
        category: fieldErrors.properties?.category?.errors[0] || '',
        weight: fieldErrors.properties?.weight?.errors[0] || '',
      })
      return
    }

    const new_data = {
      ...data,
      committee_title: committee.translations[0].title.toLowerCase(),
    }

    try {
      const response = await fetch('/api/committee_positions', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(new_data),
      })

      if (response.ok) {
        const response_data = (await response.json()) as {
          committee_position_id: string
        }
        onSuccess({
          author_type: 'COMMITTEE_POSITION',
          active: true,
          category: new_data.category as CommitteePositionCategory,
          email: new_data.email,
          weight: new_data.weight,
          base: false,
          committee_position_id: response_data.committee_position_id,
          role: 'COMMITTEE',
          translations: new_data.translations.map((t) => ({
            title: t.title,
            description: t.description,
            language_code: t.language_code as LanguageCode,
          })),
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const categories: { value: CommitteePositionCategory; label: string }[] = [
    {
      value: 'STYRELSEN',
      label: 'Styrelsen',
    },
    {
      value: 'STUDIESOCIALT',
      label: 'Studiesocialt',
    },
    {
      value: 'NÄRINGSLIV OCH KOMMUNIKATION',
      label: 'Näringsliv och kommunikation',
    },
    {
      value: 'UTBILDNING',
      label: 'Utbildning',
    },
    {
      value: 'VALBEREDNINGEN',
      label: 'Valberedningen',
    },
    {
      value: 'KÅRFULLMÄKTIGE',
      label: 'Kårfullmäktige',
    },
    {
      value: 'REVISORER',
      label: 'Revisorer',
    },
    {
      value: 'FANBORGEN',
      label: 'Fanborgen',
    },
    {
      value: 'NONE',
      label: 'N/A',
    },
  ] as const

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

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(form)
          }}
        >
          <div>
            <Label className='text-sm font-semibold'>{t('email_label')}</Label>

            <Input
              id='email'
              type='email'
              placeholder={t('email_placeholder')}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {formErrors.email && (
              <p className='text-red-500 text-xs mt-1'>{formErrors.email}</p>
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
              {formErrors.translations?.[language] && (
                <div className='mt-2 text-red-500 text-xs'>
                  <p>{formErrors.translations[language].title}</p>
                  <p>{formErrors.translations[language].description}</p>
                </div>
              )}
            </TabsContent>
          ))}

          <div>
            <Label className='text-sm font-semibold'>
              {t('category_label')}
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
                  {form.category
                    ? categories.find((c) => c.value === value)?.label
                    : t('category_placeholder')}
                  <ChevronDownIcon className='w-4 h-4 ml-2' />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput
                    placeholder={t('category_search_placeholder')}
                  />
                  <CommandEmpty>{t('category_not_found')}</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.value}
                          value={category.value}
                          onSelect={() => {
                            setForm({
                              ...form,
                              category: category.value,
                            })
                            setValue(category.value)
                            setPopoverOpen(false)
                          }}
                        >
                          {category.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {formErrors.category && (
              <p className='text-red-500 text-xs mt-1'>{formErrors.category}</p>
            )}
          </div>

          {role === Role.ADMIN && (
            <div>
              <Label className='text-sm font-semibold'>
                {t('weight_label')}
              </Label>
              <Input
                id='weight'
                type='number'
                placeholder={t('weight_placeholder')}
                value={form.weight}
                onChange={(e) =>
                  setForm({ ...form, weight: Number(e.target.value) })
                }
              />
              <p className='text-xs text-muted-foreground mb-2'>
                {t('weight_description')}
              </p>
              {formErrors.weight && (
                <p className='text-red-500 text-xs mt-1'>{formErrors.weight}</p>
              )}
            </div>
          )}

          <Button type='submit' className='w-full mt-4'>
            {t('submit_button')}
          </Button>
        </form>
      </Tabs>
    </DialogContent>
  )
}
