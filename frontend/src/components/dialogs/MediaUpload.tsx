'use client'

import { SUPPORTED_LANGUAGES } from '@/app/i18n/settings'
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
import type Album from '@/models/Album'
import type { Author } from '@/models/Items'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { mediaUploadSchema } from '@/schemas/items/media'
import { API_BASE_URL, LANGUAGES } from '@/utility/Constants'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { type JSX, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

interface Props {
  language: LanguageCode
  author: Author
  album: Album | null
  callback: () => void
}

interface TranslatedInputsProps {
  language: string
  index: number
}

function TranslatedInputs({
  language,
  index,
}: TranslatedInputsProps): JSX.Element {
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
              Title{' '}
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
            <FormLabel className='leading-tight'>
              Description{' '}
              <span className='uppercase text-xs tracking-wide'>
                [{language}]
              </span>
            </FormLabel>
            <Textarea id='description' placeholder='Description' {...field} />
            <FormDescription>
              Max length: 255 characters, optional
            </FormDescription>
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />
    </>
  )
}

export default function MediaUpload({
  language,
  author,
  album,
  callback,
}: Props) {
  const [value, _] = useState('image')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { student } = useAuthentication()

  const form = useForm<z.infer<typeof mediaUploadSchema>>({
    resolver: zodResolver(mediaUploadSchema),
    defaultValues: {
      media_type: 'image',
      media: '',
      youtube_url: '',
      translations: SUPPORTED_LANGUAGES.map((language) => ({
        language_code: language,
        title: '',
        description: '',
      })),
    },
  })

  const postForm = async (data: z.infer<typeof mediaUploadSchema>) => {
    if (!student) {
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
      const response = await fetch(`${API_BASE_URL}/media`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (response.ok) {
        alert('Media uploaded successfully')
        callback()
        form.reset()
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
        <form onSubmit={form.handleSubmit(postForm)}>
          <Form {...form}>
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
              name='media_type'
              render={({ field }) => (
                <FormItem className='flex flex-col my-2'>
                  <FormLabel>Media Type</FormLabel>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          aria-expanded={popoverOpen}
                          value={value}
                          className='w-52 justify-between'
                        >
                          {field.value
                            ? mediaTypes.find((t) => t.value === value)?.label
                            : 'Document'}
                          <ChevronDownIcon className='w-4 h-4 ml-2' />
                        </Button>
                      </FormControl>
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
                                  form.setValue(
                                    'media_type',
                                    mediaType.value as 'image' | 'video'
                                  )
                                  setPopoverOpen(false)
                                  form.setValue('media', '')
                                  form.setValue('youtube_url', '')
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
                  <FormMessage className='text-xs font-bold' />
                </FormItem>
              )}
            />

            {form.watch('media_type') === 'image' && (
              <FormField
                name='media'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <Input
                      id='media'
                      type='file'
                      accept={ACCEPTED_FILE_TYPES.join(', ')}
                      onChange={(event) => {
                        const file = event.target.files
                          ? event.target.files[0]
                          : null

                        if (!file) return

                        if (file.size > MAX_FILE_SIZE) {
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
                      Max file size: {MAX_FILE_SIZE / 1024 / 1024} MB
                    </FormDescription>
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />
            )}

            {form.watch('media_type') === 'video' && (
              <FormField
                name='youtube_url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL</FormLabel>
                    <Input
                      id='youtube_url'
                      placeholder='YouTube URL'
                      {...field}
                    />
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />
            )}

            <Button type='submit' className='w-full my-2'>
              Upload
            </Button>
          </Form>
        </form>
      </Tabs>
    </DialogContent>
  )
}
