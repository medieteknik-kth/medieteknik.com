'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LanguageCode } from '@/models/Language'
import { albumUploadSchema } from '@/schemas/items/album'
import { LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { useState } from 'react'
import { z } from 'zod/v4-mini'

interface Props {
  language: LanguageCode
  callback: () => void
}

export default function CreateAlbum({ language, callback }: Props) {
  const { t } = useTranslation(language, 'media')
  const [form, setForm] = useState<z.infer<typeof albumUploadSchema>>({
    translations: SUPPORTED_LANGUAGES.map((lang) => ({
      language_code: lang,
      title: '',
      description: '',
    })),
  })
  const [formErrors, setFormErrors] = useState({
    translations: SUPPORTED_LANGUAGES.reduce(
      (acc, lang) => {
        acc[lang] = {
          title: '',
          description: '',
        }
        return acc
      },
      {} as Record<LanguageCode, { title: string; description: string }>
    ),
  })

  const submit = async (data: z.infer<typeof albumUploadSchema>) => {
    const errors = albumUploadSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)

      const defaultTranslations = SUPPORTED_LANGUAGES.reduce(
        (acc, lang) => {
          acc[lang] = { title: '', description: '' }
          return acc
        },
        {} as Record<LanguageCode, { title: string; description: string }>
      )

      setFormErrors({
        translations:
          fieldErrors.properties?.translations?.items?.reduce(
            (acc, item, index) => {
              const lang = SUPPORTED_LANGUAGES[index]
              acc[lang] = {
                title: item.properties?.title?.errors[0] || '',
                description: item.properties?.description?.errors[0] || '',
              }
              return acc
            },
            defaultTranslations
          ) || defaultTranslations,
      })
    }

    try {
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (response.ok) {
        callback()
        window.location.reload()
      } else {
        throw new Error('Failed to create album')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('create_new_album')}</DialogTitle>
        <DialogDescription>
          {t('create_new_album.description')}
        </DialogDescription>
      </DialogHeader>
      <Tabs>
        <Label>{t('language')}</Label>
        <TabsList className='overflow-x-auto h-fit w-full justify-start'>
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
          {SUPPORTED_LANGUAGES.map((language, index) => (
            <TabsContent key={language} value={language}>
              <Input id='language' type='hidden' value={language} />

              <div>
                <Label className='text-sm font-semibold'>
                  {t('title_placeholder')}{' '}
                  <span className='uppercase text-xs tracking-wide'>
                    [{language}]
                  </span>
                </Label>
                <Input
                  id='language_code'
                  placeholder='Title'
                  value={form.translations[index].title}
                  onChange={(e) => {
                    const newTranslations = [...form.translations]
                    newTranslations[index].title = e.target.value
                    setForm({ ...form, translations: newTranslations })
                  }}
                />
                {formErrors.translations[language].title && (
                  <p className='text-red-500 text-xs font-bold'>
                    {formErrors.translations[language].title}
                  </p>
                )}
              </div>

              <div>
                <Label className='text-sm font-semibold'>
                  {t('description_placeholder')}{' '}
                  <span className='uppercase text-xs tracking-wide'>
                    [{language}]
                  </span>
                </Label>
                <Input
                  id='description'
                  placeholder='Description'
                  value={form.translations[index].description}
                  onChange={(e) => {
                    const newTranslations = [...form.translations]
                    newTranslations[index].description = e.target.value
                    setForm({ ...form, translations: newTranslations })
                  }}
                />
                {formErrors.translations[language].description && (
                  <p className='text-red-500 text-xs font-bold'>
                    {formErrors.translations[language].description}
                  </p>
                )}
              </div>
            </TabsContent>
          ))}

          <Button type='submit' className='w-full my-2'>
            {t('create_album')}
          </Button>
        </form>
      </Tabs>
    </DialogContent>
  )
}
