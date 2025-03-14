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
import type Committee from '@/models/Committee'
import type {
  CommitteePosition,
  CommitteePositionCategory,
} from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { Role } from '@/models/Permission'
import { useStudent } from '@/providers/AuthenticationProvider'
import { addPositionSchema } from '@/schemas/committee/position'
import {
  API_BASE_URL,
  LANGUAGES,
  SUPPORTED_LANGUAGES,
} from '@/utility/Constants'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

function TranslatedInputs({
  index,
  language,
}: {
  index: number
  language: LanguageCode
}) {
  const { t } = useTranslation(language, 'committee_management/forms/position')

  return (
    <>
      <FormField
        name={`translations.${index}.language_code`}
        render={({ field }) => (
          <FormItem>
            <Input id='language' type='hidden' {...field} />
          </FormItem>
        )}
      />

      <FormField
        name={`translations.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('title_label')}{' '}
              <span className='uppercase text-xs tracking-wide'>
                [{LANGUAGES[language].name}]
              </span>
            </FormLabel>
            <FormControl>
              <Input
                id='title'
                placeholder={t('title_placeholder')}
                {...field}
              />
            </FormControl>
            <FormDescription>{t('title_description')}</FormDescription>
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
              <Textarea
                id='description'
                placeholder={t('description_placeholder')}
                {...field}
              />
            </FormControl>
            <FormDescription>{t('description_description')}</FormDescription>
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />
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

  const form = useForm<z.infer<typeof addPositionSchema>>({
    resolver: zodResolver(addPositionSchema),
    defaultValues: {
      email: '',
      weight: 1000,
      category: 'NONE',
      translations: SUPPORTED_LANGUAGES.map((language) => ({
        language_code: language,
        title: '',
        description: '',
      })),
    },
  })

  const publish = async (data: z.infer<typeof addPositionSchema>) => {
    const new_data = {
      ...data,
      committee_title: committee.translations[0].title.toLowerCase(),
    }

    try {
      const response = await fetch(`${API_BASE_URL}/committee_positions/`, {
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

        <form onSubmit={form.handleSubmit(publish)}>
          <Form {...form}>
            <FormField
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email_label')}</FormLabel>
                  <FormControl>
                    <Input
                      id='email'
                      type='email'
                      placeholder={t('email_placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {SUPPORTED_LANGUAGES.map((language, index) => (
              <TabsContent key={language} value={language}>
                <TranslatedInputs index={index} language={language} />
              </TabsContent>
            ))}

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='flex flex-col my-2'>
                  <FormLabel>{t('category_label')}</FormLabel>
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
                            ? categories.find((c) => c.value === value)?.label
                            : t('category_placeholder')}
                          <ChevronDownIcon className='w-4 h-4 ml-2' />
                        </Button>
                      </FormControl>
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
                                  form.setValue('category', category.value)
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {role === Role.ADMIN && (
              <FormField
                name='weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('weight_label')}</FormLabel>
                    <FormControl>
                      <Input
                        id='weight'
                        type='number'
                        placeholder={t('weight_placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t('weight_description')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type='submit' className='w-full mt-4'>
              {t('submit_button')}
            </Button>
          </Form>
        </form>
      </Tabs>
    </DialogContent>
  )
}
