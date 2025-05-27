'use client'

import { useTranslation } from '@/app/i18n/client'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { LanguageCode } from '@/models/Language'
import { uploadNewsSchema } from '@/schemas/items/news'
import { LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import {
  DocumentTextIcon,
  EyeIcon,
  InboxIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { type JSX, useState } from 'react'
import { mutate } from 'swr'
import { z } from 'zod/v4-mini'
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
  const [form, setForm] = useState<z.infer<typeof uploadNewsSchema>>({
    title: content.translations[0].title || '',
    image: undefined,
    short_description: content.translations[0].short_description || '',
  })
  const [formErrors, setFormErrors] = useState({
    title: '',
    image: '',
    short_description: '',
  })

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ] as const

  const submit = async (data: z.infer<typeof uploadNewsSchema>) => {
    const errors = uploadNewsSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        title: fieldErrors.properties?.title?.errors[0] || '',
        image: fieldErrors.properties?.image?.errors[0] || '',
        short_description:
          fieldErrors.properties?.short_description?.errors[0] || '',
      })
      setLoading(false)
      return
    }

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
        `/api/news/${slug}/publish?language=${language}`,
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
            onClick={async () => {
              const res = await saveCallback(language, true)

              if (res === AutoSaveResult.SUCCESS) {
                await mutate(`/api/news/${slug}?language=${language}`)
                push(
                  `/${language}/bulletin/news/upload/${slug}/preview${
                    content.author.author_type === 'COMMITTEE'
                      ? `?committee=${content.author.translations[0].title.toLowerCase()}`
                      : ''
                  }`
                )
              } else {
                addNotification(t('save.error'))
              }
            }}
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
                        <p className='w-6 h-6 mr-2'>
                          {LANGUAGES[lang as LanguageCode].flag_icon}
                        </p>
                        <p className='text-sm'>{LANGUAGES[lang].name}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    submit(form)
                    setLoading(true)
                    setTimeout(() => {
                      setLoading(false)
                    }, 3000)
                  }}
                >
                  <div>
                    <Label className='text-sm font-semibold'>Title</Label>
                    <Input
                      id='title'
                      placeholder='Title'
                      value={form.title}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          title: e.target.value,
                        })
                      }}
                    />
                    {formErrors.title && (
                      <p className='text-xs text-red-500 mt-1'>
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className='text-sm font-semibold mt-4'>Image</Label>
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

                        setForm({
                          ...form,
                          image: file,
                        })
                      }}
                    />
                    {formErrors.image && (
                      <p className='text-xs text-red-500 mt-1'>
                        {formErrors.image}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className='text-sm font-semibold mt-4'>
                      {t('publish.short_description')}
                    </Label>
                    <p className='text-xs text-muted-foreground'>
                      {t('publish.short_description.description')}
                    </p>
                    <Textarea
                      placeholder='Description'
                      value={form.short_description}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          short_description: e.target.value,
                        })
                      }}
                    />
                  </div>

                  <Button
                    className='w-full my-4'
                    type='submit'
                    disabled={loading}
                  >
                    {t('publish')}
                  </Button>
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
