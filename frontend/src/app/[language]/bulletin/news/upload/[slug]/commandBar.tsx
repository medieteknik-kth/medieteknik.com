'use client'

import { useTranslation } from '@/app/i18n/client'
import { SUPPORTED_LANGUAGES } from '@/app/i18n/settings'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { LanguageCode } from '@/models/Language'
import { uploadNewsSchema } from '@/schemas/items/news'
import { API_BASE_URL, LANGUAGES } from '@/utility/Constants'
import {
  DocumentTextIcon,
  EyeIcon,
  InboxIcon,
} from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { type JSX, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { AutoSaveResult, useAutoSave } from './autoSave'

interface Props {
  language: LanguageCode
  slug: string
}

/**
 * @name CommandBar
 * @description The component that renders the command bar for the news upload page
 *
 * @param {Props} props
 * @param {string} props.language - The language of the article
 * @param {string} props.slug - The slug of the article
 * @returns {JSX.Element} The command bar for the news upload page
 */
export default function CommandBar({ language, slug }: Props): JSX.Element {
  const { saveCallback, notifications, addNotification, content } =
    useAutoSave()
  const { push } = useRouter()

  const [title, setTitle] = useState(
    content.translations[0].title || 'Untitled Article'
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation(language, 'article')

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  const form = useForm<z.infer<typeof uploadNewsSchema>>({
    resolver: zodResolver(uploadNewsSchema),
    defaultValues: {
      title: content.translations[0].title,
    },
  })

  const postForm = async (data: z.infer<typeof uploadNewsSchema>) => {
    await saveCallback(language, true)

    const formData = new window.FormData()

    formData.append('author', JSON.stringify(content.author))

    SUPPORTED_LANGUAGES.forEach((lang, index) => {
      formData.append(`translations[${index}][language_code]`, lang)
      formData.append(`translations[${index}][title]`, data.title)
      if (data.image) {
        formData.append(`translations[${index}][main_image_url]`, data.image)
      }
      formData.append(
        `translations[${index}][short_description]`,
        data.short_description
      )
    })

    try {
      const response = await fetch(
        `${API_BASE_URL}/news/${slug}/publish?language=${language}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        }
      )

      if (response.ok) {
        const json = await response.json()
        push(`/${language}/bulletin/news/${json.url}`)
      } else {
        setError('Something went wrong')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-fit flex flex-col bg-white dark:bg-[#0D0D0D] fixed border-b-2 border-yellow-400 z-30'>
      <div className='flex justify-between px-6'>
        <div className='w-fit h-24 flex flex-col justify-center'>
          <Breadcrumb className=''>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='#'>{t('articles')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='#' className='max-w-40 truncate'>
                  {title}
                </BreadcrumbLink>
                <Badge className='ml-2' variant='outline'>
                  {t('drafts')}
                </Badge>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='flex items-center mt-2'>
            <div className='flex items-center relative'>
              <div className='relative flex flex-col items-center'>
                <DocumentTextIcon className='w-8 h-8 text-green-600 dark:text-green-500' />
                <p className='text-xs'>{t('news')}</p>
              </div>
              <Input
                name='title'
                id='title'
                defaultValue={content.translations[0].title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-96 ml-2'
              />
              <Button
                variant={'outline'}
                size={'icon'}
                className='ml-4'
                title='Import/Export'
                aria-label='Import or Export'
                disabled // TODO: Enable when import/export is ready
              >
                <InboxIcon className='w-6 h-6' />
              </Button>
              <Button
                size='icon'
                className='ml-4'
                title='Language'
                aria-label='Language'
                disabled // TODO: Enable when language is ready
              >
                <span className='w-6 h-6'>
                  {LANGUAGES['sv' as LanguageCode].flag_icon}
                </span>
              </Button>
              <Button
                className='ml-4'
                variant={'outline'}
                title={t('save')}
                aria-label={t('save')}
                onClick={() => {
                  saveCallback(language, true).then((res) => {
                    if (res === AutoSaveResult.SUCCESS) {
                      addNotification(t('save.success'))
                    } else {
                      addNotification(t('save.error'))
                    }
                  })
                }}
              >
                {t('save')}
              </Button>
              <span className='ml-4 text-xs uppercase font'>
                {notifications}
              </span>
            </div>
          </div>
        </div>
        <div className='flex items-center'>
          <Button
            className='mr-4'
            variant='outline'
            size='icon'
            title='Preview'
            aria-label='Preview'
            disabled // TODO: Enable when preview is ready
          >
            <EyeIcon className='w-6 h-6' />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  saveCallback(language, true)
                }}
              >
                {t('publish')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('publish')}</DialogTitle>
                <DialogDescription>
                  {t('publish.description')}
                  <br />
                  <span className='text-red-500'>{error}</span>
                </DialogDescription>
                <div className='mb-4'>
                  <p>{t('publish.availablility')}</p>
                  <ul className='flex'>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <li key={lang} className='mr-4 last:mr-0'>
                        <span className='w-6 h-6 mr-2'>
                          {LANGUAGES[language as LanguageCode].flag_icon}
                        </span>
                        <span className='text-sm'>{LANGUAGES[lang].name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit(postForm)()
                    setLoading(true)
                    setTimeout(() => {
                      setLoading(false)
                    }, 3000)
                  }}
                >
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl className='w-full'>
                            <Input placeholder='Title' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='image'
                      render={({ field }) => (
                        <FormItem className='mt-4'>
                          <FormLabel>Image</FormLabel>
                          <Input
                            type='file'
                            accept={ACCEPTED_IMAGE_TYPES.join(', ')}
                            onChange={(event) => {
                              const file = event.target.files
                                ? event.target.files[0]
                                : null

                              if (!file) return

                              if (file.size > MAX_FILE_SIZE) {
                                setError('File is too large')
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='short_description'
                      render={({ field }) => (
                        <FormItem className='mt-4'>
                          <FormLabel>
                            {t('publish.short_description')}
                          </FormLabel>
                          <FormControl className='w-full'>
                            <Textarea placeholder='Description' {...field} />
                          </FormControl>
                          <FormDescription>
                            {t('publish.short_description.description')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className='w-full my-4'
                      type='submit'
                      disabled={loading}
                    >
                      {t('publish')}
                    </Button>
                  </Form>
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
