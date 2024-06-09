'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DocumentTextIcon,
  EyeIcon,
  InboxIcon,
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { useAutoSave, AutoSaveResult } from './autoSave'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Loading from '@/components/tooltips/Loading'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { API_BASE_URL } from '@/utility/Constants'
import { useRouter } from 'next/navigation'
import News from '@/models/Items'

export default function CommandBar({ language }: { language: string }) {
  const {
    saveCallback,
    notifications,
    addNotification,
    content,
    updateContent,
  } = useAutoSave()
  const [title, setTitle] = useState(
    content.translation.title || 'Untitled Article'
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()

  const formSchema = z.object({
    title: z.string(),
    image: z.instanceof(window.File).optional().or(z.any()),
    short_description: z.string().max(120, { message: 'Too long' }),
  })

  const MAX_FILE_SIZE = 500 * 1024
  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: content.translation.title,
      image: content.translation.main_image_url,
    },
  })

  const postForm = async (data: z.infer<typeof formSchema>) => {
    await saveCallback(language, true)

    const json_data = {
      ...content,
      translation: {
        ...content.translation,
        title: data.title,
        main_image_url: data.image,
        short_description: data.short_description,
      },
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/news/${content.url}/publish?language=${language}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(json_data),
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

  const languageFlags = new Map([
    ['en', 'gb'],
    ['sv', 'se'],
  ])

  const languageNames = new Map([
    ['en', 'English'],
    ['sv', 'Svenska'],
  ])

  const getFlagCode = (lang: string) => {
    return languageFlags.get(lang) || 'xx'
  }

  const getLanguageName = (lang: string) => {
    return languageNames.get(lang) || 'Unknown'
  }

  return (
    <div className='w-full h-fit flex flex-col bg-white dark:bg-[#0D0D0D] fixed border-b-2 border-yellow-400 z-30'>
      <div className='flex justify-between px-6'>
        <div className='w-fit h-24 flex flex-col justify-center'>
          <Breadcrumb className=''>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='#'>Styrelsen</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='#'>Articles</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='#' className='max-w-40 truncate'>
                  {title}
                </BreadcrumbLink>
                <Badge className='ml-2' variant='outline'>
                  Draft
                </Badge>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='flex items-center mt-2'>
            <div className='flex items-center relative'>
              <DocumentTextIcon className='w-8 h-8 text-green-600 dark:text-green-500' />
              <p className='absolute text-xs top-8'>News</p>
              <Input
                name='title'
                id='title'
                defaultValue={content.translation.title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-96 ml-2'
              />
              <Button
                variant={'outline'}
                size={'icon'}
                className='ml-4'
                title='Import/Export'
                aria-label='Import or Export'
              >
                <InboxIcon className='w-6 h-6' />
              </Button>
              <Button
                size='icon'
                className='ml-4'
                title='Language'
                aria-label='Language'
              >
                <span className={`fi fi-${getFlagCode(language)}`} />
              </Button>
              <Button
                className='ml-4'
                variant={'outline'}
                title='Save'
                aria-label='Save'
                onClick={() => {
                  saveCallback(language, true).then((res) => {
                    if (res === AutoSaveResult.SUCCESS) {
                      addNotification('Saved')
                    } else {
                      addNotification('Failed to save')
                    }
                  })
                }}
              >
                Save
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
                Publish
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Publish</DialogTitle>
                <DialogDescription>
                  Finalize your article for publishing.
                  <br />
                  <span className='text-red-500'>{error}</span>
                </DialogDescription>
                <div className='mb-4'>
                  <p>Article Avaliablity</p>
                  <ul className='flex'>
                    {Array.from(languageFlags.keys()).map((lang) => (
                      <li key={lang} className='mr-4 last:mr-0'>
                        <span
                          className={`fi fi-${languageFlags.get(
                            lang
                          )} mr-2 text-sm`}
                        />
                        <span className='text-sm'>{getLanguageName(lang)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />

                <Form {...form}>
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
                      control={form.control}
                      name='image'
                      render={({ field }) => (
                        <FormItem className='mt-4'>
                          <FormLabel>Image</FormLabel>
                          <FormControl className='w-full'>
                            <Input type='file' placeholder='Image' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='short_description'
                      render={({ field }) => (
                        <FormItem className='mt-4'>
                          <FormLabel>Short Description</FormLabel>
                          <FormControl className='w-full'>
                            <Textarea placeholder='Description' {...field} />
                          </FormControl>
                          <FormDescription>
                            Will be shown outside of the article
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
                      Submit
                    </Button>
                  </form>
                </Form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
