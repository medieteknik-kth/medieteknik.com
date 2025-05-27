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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { Permission } from '@/models/Permission'
import { usePermissions, useStudent } from '@/providers/AuthenticationProvider'
import { editCommitteeSchema } from '@/schemas/committee/edit'
import { LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { type JSX, useState } from 'react'
import { z } from 'zod/v4-mini'

interface Props {
  language: LanguageCode
  committee: Committee
}

interface TranslatedProps {
  index: number
  language: string
  form: z.infer<typeof editCommitteeSchema>
  setForm: React.Dispatch<
    React.SetStateAction<z.infer<typeof editCommitteeSchema>>
  >
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
function TranslatedInputs({
  index,
  language,
  form,
  setForm,
}: TranslatedProps): JSX.Element {
  return (
    <>
      <div>
        <Input id={`${language}_${index}`} type='hidden' value={language} />
      </div>

      <div>
        <Label className='text-sm font-semibold'>
          Description{' '}
          <span className='uppercase text-xs tracking-wide select-none'>
            [{language}]
          </span>
        </Label>

        <Textarea
          id={`description_${index}`}
          placeholder='Description'
          value={form.translations[index].description}
          onChange={(e) => {
            const newTranslations = [...form.translations]
            newTranslations[index].description = e.target.value
            setForm({ ...form, translations: newTranslations })
          }}
        />
      </div>
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
  const [form, setForm] = useState<z.infer<typeof editCommitteeSchema>>({
    title: committee.translations[0].title,
    translations: SUPPORTED_LANGUAGES.map((lang) => ({
      language_code: lang,
      description:
        committee.translations.find(
          (translation) => translation.language_code === lang
        )?.description || '',
    })),
    logo: undefined,
    group_photo: undefined,
  })
  const [formErrors, setFormErrors] = useState({
    title: '',
    translations: SUPPORTED_LANGUAGES.map(() => ({ description: '' })),
    logo: '',
    group_photo: '',
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

  const submit = async (data: z.infer<typeof editCommitteeSchema>) => {
    const errors = editCommitteeSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        title: fieldErrors.properties?.title?.errors[0] || '',
        translations: SUPPORTED_LANGUAGES.map((lang, index) => ({
          description:
            fieldErrors.properties?.translations?.items?.[index]?.properties
              ?.description?.errors[0] || '',
        })),
        logo: fieldErrors.properties?.logo?.errors[0] || '',
        group_photo: fieldErrors.properties?.group_photo?.errors[0] || '',
      })
      setErrorMessage('Invalid form data')
      return
    }

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
        `/api/committees/${committee.translations[0].title.toLowerCase()}`,
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
            <Label className='text-sm font-semibold'>
              {t('edit_public_details.form.email')}
            </Label>
            <Input
              value={committee.email}
              disabled
              readOnly
              title='Contact an administrator to change the email.'
            />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(form)
            }}
          >
            <div>
              <Label className='text-sm font-semibold'>
                {t('edit_public_details.form.title')}
              </Label>
              <Input
                id='title'
                placeholder='Title'
                onChange={(e) => {
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }}
              />
              {formErrors.title && (
                <p className='text-red-500 text-xs'>{formErrors.title}</p>
              )}
            </div>

            {SUPPORTED_LANGUAGES.map((language, index) => (
              <TabsContent key={language} value={language}>
                <TranslatedInputs
                  index={index}
                  language={LANGUAGES[language].name}
                  form={form}
                  setForm={setForm}
                />
              </TabsContent>
            ))}

            <div>
              <Label className='text-sm font-semibold'>
                {t('edit_public_details.form.logo')}
              </Label>
              <p className='text-xs text-gray-500'>
                {t('edit_public_details.form.logo.requirements')}
              </p>
              <Input
                id='logo'
                accept='image/svg+xml'
                type='file'
                onChange={(event) => {
                  const file = event.target.files ? event.target.files[0] : null

                  if (!file) return

                  if (file.size > MAX_LOGO_FILE_SIZE) {
                    alert('File is too large')
                    event.target.value = ''
                    return
                  }

                  setForm({
                    ...form,
                    logo: file,
                  })
                }}
              />
              {formErrors.logo && (
                <p className='text-red-500 text-xs'>{formErrors.logo}</p>
              )}
            </div>

            <div>
              <Label className='text-sm font-semibold'>
                {t('edit_public_details.form.group_photo')}
              </Label>
              <p className='text-xs text-gray-500'>
                {t('edit_public_details.form.group_photo.requirements')}
              </p>

              <Input
                id='logo'
                accept='image/*'
                type='file'
                onChange={(event) => {
                  const file = event.target.files ? event.target.files[0] : null

                  if (!file) return

                  if (file.size > MAX_GROUP_PHOTO_FILE_SIZE) {
                    alert('File is too large')
                    event.target.value = ''
                    return
                  }

                  setForm({
                    ...form,
                    group_photo: file,
                  })
                }}
              />
              {formErrors.group_photo && (
                <p className='text-red-500 text-xs'>{formErrors.group_photo}</p>
              )}
            </div>

            <Button type='submit' className='w-full'>
              Save
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
