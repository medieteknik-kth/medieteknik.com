'use client'

import Loading from '@/components/tooltips/Loading'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Author } from '@/models/Items'
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import { createNewsSchema } from '@/schemas/items/news'
import { useRouter } from 'next/navigation'
import { type JSX, useEffect, useState } from 'react'
import { z } from 'zod/v4-mini'

interface NewsUploadProps {
  language: LanguageCode
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
  const { student } = useStudent()
  const { push } = useRouter()
  const [form, setForm] = useState<z.infer<typeof createNewsSchema>>({
    title: '',
  })
  const [formErrors, setFormErrors] = useState({
    title: '',
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return <></>

  if (!student) {
    return <></>
  }

  const submit = async (data: z.infer<typeof createNewsSchema>) => {
    if (!student) {
      return
    }

    const errors = createNewsSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        title: fieldErrors.properties?.title?.errors[0] || '',
      })
    }

    const json: {
      published_status: string
      translations: {
        title: string
        language_code: string
      }[]
      author: Author
    } = {
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
      const response = await fetch(`/api/news?language=${language}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(json),
      })

      if (response.ok) {
        const jsonResponse = await response.json()
        await new Promise((resolve) => setTimeout(resolve, 3000))
        push(`/${language}/bulletin/news/upload/${jsonResponse.url}`)
      } else {
        setError('Something went wrong, try again later')
        setLoading(false)
      }
    } catch (error) {
      setError(`Something went wrong, try again later: ${error}`)
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
          <p className='text-xs text-muted-foreground'>
            The title of your article, it will be used to identify the article
            in the news list. You can change it later.
          </p>
          <Input
            id='title'
            placeholder='Title'
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value })
              setFormErrors({ ...formErrors, title: '' })
            }}
          />
          {formErrors.title && (
            <p className='text-xs text-red-500 mt-1'>{formErrors.title}</p>
          )}
        </div>

        <Button type='submit' className='w-full my-4' disabled={loading}>
          {loading ? <Loading language={language} /> : 'Upload'}
        </Button>
      </form>
    </DialogContent>
  )
}
