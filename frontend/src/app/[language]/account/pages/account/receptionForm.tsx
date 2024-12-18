'use client'

import { useTranslation } from '@/app/i18n/client'
import Loading from '@/components/tooltips/Loading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
import { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { receptionSchema } from '@/schemas/user/reception'
import { API_BASE_URL } from '@/utility/Constants'
import { zodResolver } from '@hookform/resolvers/zod'
import Logo from 'public/images/logo.webp'
import { JSX, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { z } from 'zod'

const fetcher = (url: string) =>
  fetch(url).then(
    (res) =>
      res.json() as Promise<{
        token: string
      }>
  )

interface Props {
  language: LanguageCode
}

/**
 * @name ReceptionForm
 * @description The component that renders the reception form, allowing the user to update their reception (mottagning) settings
 *
 * @param {Props} props
 * @param {string} props.language - The language of the reception form
 *
 * @returns {JSX.Element} The reception form
 */
export default function ReceptionForm({ language }: Props): JSX.Element {
  const [receptionPicturePreview, setReceptionPicturePreview] =
    useState<File | null>(null)
  const { student } = useAuthentication()
  const [csrfToken, setCsrfToken] = useState<string | null>()
  const { t } = useTranslation(language, 'account')

  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  const form = useForm<z.infer<typeof receptionSchema>>({
    resolver: zodResolver(receptionSchema),
    defaultValues: {
      image: Logo as unknown as File,
      receptionName: '',
    },
  })

  const {
    data: csrf,
    error,
    isLoading,
  } = useSWR(`${API_BASE_URL}/csrf-token`, fetcher)

  useEffect(() => {
    if (csrf) {
      setCsrfToken(csrf.token)
      form.setValue('csrf_token', csrf.token)
    }
  }, [csrf, form])

  if (!student) return <></> // TODO: Something better?
  if (error) return <div>Failed to load</div>
  if (isLoading) return <Loading language={language} />
  if (!csrf) return <Loading language={language} />

  const onSubmit = async (data: z.infer<typeof receptionSchema>) => {
    const formData = new FormData()

    formData.append('reception_image', data.image)
    formData.append('reception_name', data.receptionName || '')
    formData.append('csrf_token', data.csrf_token || csrf.token)

    try {
      const response = await fetch(`${API_BASE_URL}/students/reception`, {
        method: 'PUT',
        headers: {
          'X-CSRF-Token': csrfToken || data.csrf_token || '',
        },
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        alert('Failed to save')
        return
      }
    } catch (error) {
      alert('Failed to save')
      console.error(error)
      return
    }
  }

  return (
    <div className='w-full flex justify-center'>
      <Form {...form}>
        <form
          className='w-1/2 flex flex-col *:py-2'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className='text-xl font-bold border-b border-yellow-400 mb-1'>
            {t('tab_reception')}
          </h2>
          <FormField
            name='image'
            render={({ field }) => (
              <FormItem className='flex flex-col justify-around'>
                <div className='flex mb-1'>
                  <Avatar className='w-24 h-24 border-2 border-black'>
                    <AvatarImage
                      src={
                        receptionPicturePreview
                          ? URL.createObjectURL(receptionPicturePreview)
                          : student.reception_profile_picture_url || Logo.src
                      }
                    />
                    <AvatarFallback>Profile Icon</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col justify-center ml-2'>
                    <FormLabel className='pb-1'>Profile Picture</FormLabel>
                    <FormDescription>
                      PNG or JPG up to 500kb
                      <br />
                      Aspect Ratio 1:1
                    </FormDescription>
                  </div>
                </div>

                <FormControl>
                  <Input
                    type='file'
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                    value={field.value ? undefined : ''}
                    onChange={(event) => {
                      const file = event.target.files
                        ? event.target.files[0]
                        : null

                      if (!file) return

                      if (file.size > MAX_FILE_SIZE) {
                        alert('File size is too large')
                        return
                      }

                      const img = new Image()
                      img.src = URL.createObjectURL(file)
                      img.onload = () => {
                        if (img.width !== img.height) {
                          alert('Aspect ratio must be 1:1')
                          return
                        }

                        field.onChange({
                          target: {
                            name: field.name,
                            value: file,
                          },
                        })
                        setReceptionPicturePreview(file)
                      }
                      img.onerror = () => {
                        alert('Invalid image')
                        URL.revokeObjectURL(img.src)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='receptionName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reception Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed when reception mode is
                  active.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='csrf_token'
            render={({ field }) => <input type='hidden' {...field} />}
          />
          <Button
            type='submit'
            onClick={() => {
              form.setValue('csrf_token', csrf.token || '')
            }}
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  )
}
