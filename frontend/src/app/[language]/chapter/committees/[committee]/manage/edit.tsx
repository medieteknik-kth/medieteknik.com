'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { Permission } from '@/models/Permission'
import { usePermissions, useStudent } from '@/providers/AuthenticationProvider'
import { editCommitteeSchema } from '@/schemas/committee/edit'
import {
  API_BASE_URL,
  LANGUAGES,
  SUPPORTED_LANGUAGES,
} from '@/utility/Constants'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { type JSX, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

interface Props {
  language: LanguageCode
  committee: Committee
}

interface TranslatedProps {
  index: number
  language: string
}

/**
 * @name TranslatedInputs
 * @description A component for rendering the translated inputs for a committee.
 *
 * @param {TranslatedProps} props
 * @param {number} props.index - The index of the translation
 * @param {string} props.language - The language of the translation
 *
 * @returns {JSX.Element} The rendered component
 */
function TranslatedInputs({ index, language }: TranslatedProps): JSX.Element {
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
        name={`translations.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Description{' '}
              <span className='uppercase text-xs tracking-wide select-none'>
                [{language}]
              </span>
            </FormLabel>
            <Textarea id='description' placeholder='Description' {...field} />
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />
    </>
  )
}

/**
 * @name EditCommittee
 * @description A component for editing the public details of a committee.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Committee} props.committee - The committee to edit
 *
 * @returns {JSX.Element} The rendered component
 */
export default function EditCommittee({
  language,
  committee,
}: Props): JSX.Element {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const { positions } = useStudent()
  const { permissions } = usePermissions()
  const { t } = useTranslation(language, 'committee_management')

  const form = useForm<z.infer<typeof editCommitteeSchema>>({
    resolver: zodResolver(editCommitteeSchema),
    defaultValues: {
      title: committee.translations[0].title,
      translations: SUPPORTED_LANGUAGES.map((lang) => ({
        language_code: lang,
        description:
          committee.translations.find(
            (t) => t.language_code.split('-')[0] === lang
          )?.description || '',
      })),
    },
  })

  if (
    !permissions.student?.includes(Permission.COMMITTEE_EDIT) &&
    !(
      positions &&
      positions.length > 0 &&
      positions.some((position) => position.weight <= 150)
    )
  ) {
    return <></>
  }

  const MAX_LOGO_FILE_SIZE = 1 * 1024 * 1024 // 1 MB
  const MAX_GROUP_PHOTO_FILE_SIZE = 15 * 1024 * 1024 // 15 MB

  const postForm = async (data: z.infer<typeof editCommitteeSchema>) => {
    const formData = new FormData()

    // Add top-level fields
    if (data.logo) {
      formData.append('logo', data.logo)
    }

    if (data.group_photo) {
      formData.append('group_photo', data.group_photo)
    }

    // Add translation fields
    SUPPORTED_LANGUAGES.map((language, index) => {
      formData.append(`translations[${index}][language_code]`, language)
      formData.append(`translations[${index}][title]`, data.title)
      formData.append(
        `translations[${index}][description]`,
        data.translations[index].description
      )
    })

    try {
      const response = await fetch(
        `${API_BASE_URL}/committees/${committee.translations[0].title.toLowerCase()}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        }
      )

      if (response.ok) {
        setOpen(false)
      } else {
        console.error(response)
        setErrorMessage('Something went wrong. Please try again later.')
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Something went wrong. Please try again later.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          title={t('edit_public_details.description')}
        >
          <PencilSquareIcon className='w-6 h-6 mr-2' />
          <p>{t('edit_public_details')}</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('edit_public_details')}</DialogTitle>
          <DialogDescription>
            {t('edit_public_details.description')}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={language}>
          <TabsList>
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
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          <div>
            <Label>{t('edit_public_details.form.email')}</Label>
            <Input
              value={committee.email}
              disabled
              readOnly
              title='Contact an administrator to change the email.'
            />
          </div>
          <form onSubmit={form.handleSubmit(postForm)}>
            <Form {...form}>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>{t('edit_public_details.form.title')}</FormLabel>
                    <Input id='title' placeholder='Title' {...field} />
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />

              {SUPPORTED_LANGUAGES.map((language, index) => (
                <TabsContent key={language} value={language}>
                  <TranslatedInputs
                    index={index}
                    language={LANGUAGES[language].name}
                  />
                </TabsContent>
              ))}

              <FormField
                control={form.control}
                name='logo'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>{t('edit_public_details.form.logo')}</FormLabel>
                    <Input
                      id='logo'
                      accept='image/svg+xml'
                      type='file'
                      onChange={(event) => {
                        const file = event.target.files
                          ? event.target.files[0]
                          : null

                        if (!file) return

                        if (file.size > MAX_LOGO_FILE_SIZE) {
                          alert('File is too large')
                          event.target.value = ''
                          return
                        }

                        field.onChange({
                          target: {
                            name: field.name,
                            value: file,
                          },
                        })
                      }}
                    />
                    <FormDescription>
                      {t('edit_public_details.form.logo.requirements')}
                    </FormDescription>
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='group_photo'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>
                      {t('edit_public_details.form.group_photo')}
                    </FormLabel>
                    <Input
                      id='logo'
                      accept='image/*'
                      type='file'
                      onChange={(event) => {
                        const file = event.target.files
                          ? event.target.files[0]
                          : null

                        if (!file) return

                        if (file.size > MAX_GROUP_PHOTO_FILE_SIZE) {
                          alert('File is too large')
                          event.target.value = ''
                          return
                        }

                        field.onChange({
                          target: {
                            name: field.name,
                            value: file,
                          },
                        })
                      }}
                    />
                    <FormDescription>
                      {t('edit_public_details.form.group_photo.requirements')}
                    </FormDescription>
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                Save
              </Button>
            </Form>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
