'use client'

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
import type Album from '@/models/Album'
import type { Author } from '@/models/Items'
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import { mediaUploadSchema } from '@/schemas/items/media'
import { LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { type JSX, useState } from 'react'
import { z } from 'zod/v4-mini'

interface Props {
  language: LanguageCode
  author: Author
  album: Album | null
  callback: () => void
}

interface TranslatedInputsProps {
  language: string
  index: number
  form: z.infer<typeof mediaUploadSchema>
  setForm: React.Dispatch<
    React.SetStateAction<z.infer<typeof mediaUploadSchema>>
  >
  formErrors: {
    media_type: string
    media: string
    youtube_url: string
    translations: { title: string; description: string }[]
  }
}

function TranslatedInputs({
  language,
  index,
  form,
  setForm,
  formErrors,
}: TranslatedInputsProps): JSX.Element {
  return (
    <>
      <div>
        <Input id='language' type='hidden' value={language} />
      </div>

      <div>
        <Label className='text-sm font-semibold'>
          Title{' '}
          <span className='uppercase text-xs tracking-wide'>[{language}]</span>
        </Label>

        <Input
          id='title'
          placeholder='Title'
          value={form.translations[index].title}
          onChange={(e) => {
            const newTranslations = [...form.translations]
            newTranslations[index].title = e.target.value
            setForm({ ...form, translations: newTranslations })
          }}
        />
        {formErrors.translations[index].title && (
          <p className='text-red-500 text-xs mt-1'>
            {formErrors.translations[index].title}
          </p>
        )}
      </div>

      <div>
        <Label className='text-sm font-semibold'>
          Description{' '}
          <span className='uppercase text-xs tracking-wide'>[{language}]</span>
        </Label>
        <Textarea
          id='description'
          placeholder='Description'
          value={form.translations[index].description}
          onChange={(e) => {
            const newTranslations = [...form.translations]
            newTranslations[index].description = e.target.value
            setForm({ ...form, translations: newTranslations })
          }}
        />
        {formErrors.translations[index].description && (
          <p className='text-red-500 text-xs mt-1'>
            {formErrors.translations[index].description}
          </p>
        )}
      </div>
    </>
  )
}

export default function MediaUpload({
  language,
  author,
  album,
  callback,
}: Props) {
  const [value, setValue] = useState('image')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { student } = useStudent()
  const [form, setForm] = useState<z.infer<typeof mediaUploadSchema>>({
    media_type: 'image',
    media: undefined,
    youtube_url: '',
    translations: SUPPORTED_LANGUAGES.map((lang) => ({
      language_code: lang,
      title: '',
      description: '',
    })),
  })
  const [formErrors, setFormErrors] = useState({
    media_type: '',
    media: '',
    youtube_url: '',
    translations: SUPPORTED_LANGUAGES.map(() => ({
      title: '',
      description: '',
    })),
  })

  const submit = async (data: z.infer<typeof mediaUploadSchema>) => {
    if (!student) {
      return
    }

    const errors = mediaUploadSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        media_type: fieldErrors.properties?.media_type?.errors[0] || '',
        media: fieldErrors.properties?.media?.errors[0] || '',
        youtube_url: fieldErrors.properties?.youtube_url?.errors[0] || '',
        translations:
          fieldErrors.properties?.translations?.items?.reduce(
            (acc, item, index) => {
              acc[index] = {
                title: item.properties?.title?.errors[0] || '',
                description: item.properties?.description?.errors[0] || '',
              }
              return acc
            },
            [] as { title: string; description: string }[]
          ) || ([] as { title: string; description: string }[]),
      })
      return
    }

    const formData = new FormData()
    formData.append('media_type', data.media_type)
    formData.append('author[author_type]', author.author_type)
    formData.append('author[email]', author.email || '')
    if (album) {
      formData.append('album_id', album.album_id)
    }

    if (data.media_type === 'image' && data.media) {
      formData.append('media', data.media)
    }

    if (data.media_type === 'video' && data.youtube_url) {
      formData.append('youtube_url', data.youtube_url)
    }

    SUPPORTED_LANGUAGES.forEach((language, index) => {
      formData.append(`translations[${index}][language_code]`, language)
      formData.append(
        `translations[${index}][title]`,
        data.translations[index].title
      )
      if (data.translations[index].description) {
        formData.append(
          `translations[${index}][description]`,
          data.translations[index].description
        )
      }
    })

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (response.ok) {
        alert('Media uploaded successfully')
        callback()
        setForm({
          media_type: 'image',
          media: undefined,
          youtube_url: '',
          translations: SUPPORTED_LANGUAGES.map((lang) => ({
            language_code: lang,
            title: '',
            description: '',
          })),
        })
        window.location.reload()
      } else {
        alert('Failed to upload media')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const mediaTypes = [
    { label: 'Image', value: 'image' },
    { label: 'Video', value: 'video' },
  ] as const

  const ACCEPTED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ] as const

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload Media</DialogTitle>
        <DialogDescription>
          Upload images or videos to the album. Images will be displayed in a
          gallery, while videos will be displayed in a video player.
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue={language}>
        <Label>Language</Label>
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
              <TranslatedInputs
                index={index}
                language={LANGUAGES[language].name}
                form={form}
                setForm={setForm}
                formErrors={formErrors}
              />
            </TabsContent>
          ))}

          <div>
            <Label>Media Type</Label>
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
                  className='w-52 justify-between'
                >
                  {form.media_type
                    ? mediaTypes.find((t) => t.value === value)?.label
                    : 'Document'}
                  <ChevronDownIcon className='w-4 h-4 ml-2' />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput placeholder='Search media type' />
                  <CommandEmpty>None found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {mediaTypes.map((mediaType) => (
                        <CommandItem
                          key={mediaType.value}
                          value={mediaType.value}
                          onSelect={() => {
                            setValue(mediaType.value)
                            setForm({
                              ...form,
                              media_type: mediaType.value as 'image' | 'video',
                              media: undefined,
                              youtube_url: '',
                            })
                            setPopoverOpen(false)
                          }}
                        >
                          {mediaType.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {formErrors.media_type && (
              <p className='text-red-500 text-xs mt-1'>
                {formErrors.media_type}
              </p>
            )}
          </div>

          {form.media_type === 'image' && (
            <div>
              <Label>Image</Label>
              <Input
                id='media'
                type='file'
                accept={ACCEPTED_FILE_TYPES.join(', ')}
                onChange={(event) => {
                  const file = event.target.files ? event.target.files[0] : null

                  if (!file) return

                  if (file.size > MAX_FILE_SIZE) {
                    alert('File is too large')
                    event.target.value = ''
                    return
                  }

                  setForm({
                    ...form,
                    media: file,
                  })
                }}
              />
              <p className='text-xs text-muted-foreground mt-1'>
                Max file size: {MAX_FILE_SIZE / 1024 / 1024} MB
              </p>
              {formErrors.media && (
                <p className='text-red-500 text-xs mt-1'>{formErrors.media}</p>
              )}
            </div>
          )}

          {form.media_type === 'video' && (
            <div>
              <Label>Video</Label>
              <Input
                id='media'
                type='file'
                accept='video/*'
                onChange={(event) => {
                  const file = event.target.files ? event.target.files[0] : null

                  if (!file) return

                  if (file.size > MAX_FILE_SIZE) {
                    alert('File is too large')
                    event.target.value = ''
                    return
                  }

                  setForm({
                    ...form,
                    media: file,
                  })
                }}
              />
              <p className='text-xs text-muted-foreground mt-1'>
                Max file size: {MAX_FILE_SIZE / 1024 / 1024} MB
              </p>
              {formErrors.media && (
                <p className='text-red-500 text-xs mt-1'>{formErrors.media}</p>
              )}
            </div>
          )}

          <Button type='submit' className='w-full my-2'>
            Upload
          </Button>
        </form>
      </Tabs>
    </DialogContent>
  )
}
