'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LanguageCode } from '@/models/Language'
import { albumUploadSchema } from '@/schemas/items/album'
import { API_BASE_URL, LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

interface Props {
  language: LanguageCode
  callback: () => void
}

export default function CreateAlbum({ language, callback }: Props) {
  const { t } = useTranslation(language, 'media')
  const form = useForm<z.infer<typeof albumUploadSchema>>({
    resolver: zodResolver(albumUploadSchema),
    defaultValues: {
      translations: SUPPORTED_LANGUAGES.map((language) => ({
        language_code: language,
        title: '',
        description: '',
      })),
    },
  })

  const postForm = async (data: z.infer<typeof albumUploadSchema>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/albums`, {
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
        <form onSubmit={form.handleSubmit(postForm)}>
          <Form {...form}>
            {SUPPORTED_LANGUAGES.map((language, index) => (
              <TabsContent key={language} value={language}>
                <FormField
                  name={`translations[${index}].title`}
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
                        {t('title_placeholder')}{' '}
                        <span className='uppercase text-xs tracking-wide'>
                          [{language}]
                        </span>
                      </FormLabel>
                      <Input id='title' placeholder='Title' {...field} />
                      <FormMessage className='text-xs font-bold' />
                    </FormItem>
                  )}
                />

                <FormField
                  name={`translations.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('description_placeholder')}{' '}
                        <span className='uppercase text-xs tracking-wide'>
                          [{language}]
                        </span>
                      </FormLabel>
                      <Input
                        id='description'
                        placeholder='Description'
                        {...field}
                      />
                      <FormMessage className='text-xs font-bold' />
                    </FormItem>
                  )}
                />
              </TabsContent>
            ))}

            <Button type='submit' className='w-full my-2'>
              {t('create_album')}
            </Button>
          </Form>
        </form>
      </Tabs>
    </DialogContent>
  )
}
