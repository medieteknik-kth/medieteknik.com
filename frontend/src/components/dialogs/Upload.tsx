'use client'
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
import { Button } from '@components/ui/button'
import { useState, useDeferredValue, useEffect } from 'react'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import { API_BASE_URL } from '@/utility/Constants'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { redirect } from 'next/navigation'

export function UploadNews({ language }: { language: string }) {
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const FormSchema = z.object({
    title: z.string(),
    image: z.instanceof(window.File),
  })

  const MAX_FILE_SIZE = 500 * 1024
  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: 'Untitled Article',
    },
  })

  useEffect(() => {
    setIsClient(true)
  })

  if (!isClient) return <></>

  const postForm = async (data: z.infer<typeof FormSchema>) => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('image', data.image)
    formData.append('published_status', 'DRAFT')

    const response = await fetch(
      `${API_BASE_URL}/news?language_code=${language}`,
      {
        method: 'POST',
        body: formData,
      }
    )
    if (response.ok) {
      const jsonData = JSON.parse(await response.text())

      redirect(`/${language}/bulletin/news/upload/${jsonData.url}`)
    } else {
      setError('Something went wrong')
      console.error('Something went wrong')
    }
  }

  return (
    <DialogHeader className='relative w-full'>
      <DialogTitle>Upload News</DialogTitle>
      <DialogDescription>
        Basic information about your article
      </DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(postForm)}>
          <FormField
            name='title'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input id='title' placeholder='Title' {...field} />
                </FormControl>
                <FormDescription>The title of your article</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='image'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    id='image'
                    type='file'
                    value={field.value ? undefined : ''}
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                    onChange={(event) => {
                      const file = event.target.files
                        ? event.target.files[0]
                        : null

                      if (!file) return

                      if (file.size > MAX_FILE_SIZE) {
                        alert('File is too large')
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
                </FormControl>
                <FormDescription>
                  The main image of your article, will be shown first
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='my-4'>
            Start Editing
          </Button>
        </form>
      </Form>
    </DialogHeader>
  )
}
