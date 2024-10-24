'use client'
import { supportedLanguages } from '@/app/i18n/settings'
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
import { Author } from '@/models/Items'
import { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { mediaUploadSchema } from '@/schemas/items/media'
import { API_BASE_URL, LANGUAGES } from '@/utility/Constants'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type JSX } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  language: string
  author: Author
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
            <FormLabel>
              Description{' '}
              <span className='uppercase text-xs tracking-wide'>
                [{language}]
              </span>
            </FormLabel>
            <Input id='description' placeholder='Description' {...field} />
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />
    </>
  )
}

export default function MediaUpload({ language, author }: Props) {
  const [value, _] = useState('image')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { student } = useAuthentication()
  const { setMediaTotal, total_media } = useCommitteeManagement()

  const form = useForm<z.infer<typeof mediaUploadSchema>>({
    resolver: zodResolver(mediaUploadSchema),
    defaultValues: {
      media_type: 'image',
      media: '',
      youtube_url: '',
      translations: supportedLanguages.map((language) => ({
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
    if (data.media_type === 'image' && data.media) {
      formData.append('media', data.media)
    }

    if (data.media_type === 'video' && data.youtube_url) {
      formData.append('youtube_url', data.youtube_url)
    }

    supportedLanguages.forEach((language, index) => {
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
        setMediaTotal(total_media + 1)
        form.reset()
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
  ]

  const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']
  const MAX_FILE_SIZE = 10 * 1024 * 1024

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
          {supportedLanguages.map((language) => (
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
            {supportedLanguages.map((language, index) => (
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
                        <CommandInput placeholder='Search document type' />
                        <CommandEmpty>No documents found.</CommandEmpty>
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
