'use client'
import Loading from '@/components/tooltips/Loading'
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
import { Author } from '@/models/Items'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { createNewsSchema } from '@/schemas/items/news'
import { API_BASE_URL } from '@/utility/Constants'
import { Button } from '@components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type JSX } from 'react';
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface NewsUploadProps {
  language: string
  author: Author
}

/**
 * @name NewsUpload
 * @description Upload a news article
 *
 * @param {NewsUploadProps} props - The props for the component
 * @param {string} props.language - The language of the news article
 * @param {Author} props.author - The author of the news article
 * @returns {JSX.Element} The news upload form
 */
export function NewsUpload({ language, author }: NewsUploadProps): JSX.Element {
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { student } = useAuthentication()
  const { push } = useRouter()

  const form = useForm<z.infer<typeof createNewsSchema>>({
    resolver: zodResolver(createNewsSchema),
    defaultValues: {
      title: 'Untitled Article',
    },
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return <></>

  if (!student) {
    return <></>
  }

  const postForm = async (data: z.infer<typeof createNewsSchema>) => {
    if (!student) {
      return
    }
    let json = {
      published_status: 'DRAFT',
      translations: [
        {
          title: data.title || 'Untitled Article',
          language_code: language,
        },
      ],
      author: author,
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/news?language=${language}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(json),
        }
      )

      if (response.ok) {
        const jsonResponse = await response.json()
        push(`/${language}/bulletin/news/upload/${jsonResponse.url}`)
      } else {
        setError('Something went wrong, try again later')
        setLoading(false)
      }
    } catch (error) {
      setError('Something went wrong, try again later ' + error)
      setLoading(false)
    }
  }

  return (
    <DialogContent>
      <DialogHeader className='relative w-full'>
        <DialogTitle>Upload News</DialogTitle>
        <DialogDescription>
          Basic information about your article, you will be able to edit it
          later
          <br />
          <span className='text-red-500'>{error}</span>
        </DialogDescription>
      </DialogHeader>
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

          <Button type='submit' className='w-full my-4' disabled={loading}>
            {loading ? <Loading language={language} /> : 'Upload'}
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}
