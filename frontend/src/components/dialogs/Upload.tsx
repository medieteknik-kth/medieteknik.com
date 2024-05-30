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
import { Button } from '@components/ui/button'
import { useState, useDeferredValue, useEffect } from 'react'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import { API_BASE_URL } from '@/utility/Constants'
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
import { redirect, useRouter } from 'next/navigation'

export function UploadNews({ language }: { language: string }) {
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()

  const FormSchema = z.object({
    title: z.string().optional().or(z.literal('')),
    image: z.instanceof(window.File).optional().or(z.any()),
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
    let json: {
      title?: string
      published_status: 'DRAFT' | 'PUBLISHED'
      author_id: {
        author_type: string
        entity_id: number
      }
    } = {
      title: data.title || 'Untitled Article',
      published_status: 'DRAFT',
      author_id: {
        author_type: 'STUDENT',
        entity_id: 1,
      },
    }

    // Convert formData to JSON
    const jsonData = JSON.stringify(json)

    try {
      const response = await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      })

      if (response.ok) {
        const jsonResponse = await response.json()
        push(`/${language}/bulletin/news/upload/${jsonResponse.url}`)
      } else {
        setError('Something went wrong, try again later')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong, try again later')
      setLoading(false)
    }
  }

  return (
    <DialogHeader className='relative w-full'>
      <DialogTitle>Upload News</DialogTitle>
      <DialogDescription>
        Basic information about your article, you will be able to edit it later
        <br />
        <span className='text-red-500'>{error}</span>
      </DialogDescription>
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
          <Button type='submit' className='w-full my-4' disabled={loading}>
            {loading ? <Loading language={language} /> : 'Upload'}
          </Button>
        </form>
      </Form>
    </DialogHeader>
  )
}
