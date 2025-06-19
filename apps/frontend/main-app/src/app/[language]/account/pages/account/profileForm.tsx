'use client'

import { useTranslation } from '@/app/i18n/client'
import Loading from '@/components/tooltips/Loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { LanguageCode } from '@/models/Language'
import type { Profile } from '@/models/Student'
import { profileSchema } from '@/schemas/user/profile'
import Image from 'next/image'
import FacebookLogo from 'public/images/logos/Facebook_Logo_Primary.webp'
import InstagramLogo from 'public/images/logos/Instagram_Glyph_Gradient.webp'
import LinkedInLogo from 'public/images/logos/LI-In-Bug.webp'
import { type JSX, useState } from 'react'
import useSWR from 'swr'
import { z } from 'zod/v4-mini'

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json() as Promise<Profile>)

interface Props {
  language: LanguageCode
}

/**
 * @name ProfileForm
 * @description The component that renders the profile form, allowing the user to update their social media links
 *
 * @param {Props} props
 * @param {string} props.language - The language of the profile form
 *
 * @returns {JSX.Element} The profile form
 */
export default function ProfileForm({ language }: Props): JSX.Element {
  const { data, error, isLoading } = useSWR('/api/students/profile', fetcher, {
    revalidateOnFocus: false,
    refreshWhenHidden: false,
    shouldRetryOnError: false,
  })
  const [form, setForm] = useState<z.infer<typeof profileSchema>>({
    facebook: data?.facebook_url || '',
    instagram: data?.instagram_url || '',
    linkedin: data?.linkedin_url || '',
  })
  const [formErrors, setFormErrors] = useState({
    facebook: '',
    instagram: '',
    linkedin: '',
  })

  const { t } = useTranslation(language, 'account/profile')

  if (isLoading) return <Loading language={language} />

  const submit = async (data: z.infer<typeof profileSchema>) => {
    const errors = profileSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        facebook: fieldErrors.properties?.facebook?.errors[0] || '',
        instagram: fieldErrors.properties?.instagram?.errors[0] || '',
        linkedin: fieldErrors.properties?.linkedin?.errors[0] || '',
      })
      return
    }

    try {
      const json_data = {
        facebook_url: data.facebook === '' ? null : data.facebook,
        instagram_url: data.instagram === '' ? null : data.instagram,
        linkedin_url: data.linkedin === '' ? null : data.linkedin,
      }

      const response = await fetch('/api/students/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json_data),
      })

      if (response.ok) {
        alert('Profile updated successfully')
      } else {
        alert('Failed to update profile settings')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='w-full max-w-[1100px] flex mb-8 2xl:mb-0'>
      <form
        className='w-full flex flex-col gap-4 max-h-[725px] overflow-y-auto'
        onSubmit={(e) => {
          e.preventDefault()
          submit(form)
        }}
      >
        <div className='w-full mb-4 px-4 pt-4'>
          <h2 className='text-lg font-bold'>{t('title')}</h2>
          <p className='text-sm text-muted-foreground'>{t('description')}</p>
          <Separator className='bg-yellow-400 mt-4' />
        </div>

        <div>
          <Label className='text-sm font-semibold flex gap-2 items-center'>
            <Image
              src={FacebookLogo}
              width={32}
              height={32}
              alt='Facebook Logo'
            />
            Facebook
          </Label>
          <Input
            value={form.facebook}
            onChange={(e) => {
              setForm({
                ...form,
                facebook: e.target.value,
              })
            }}
            placeholder={
              error || !data?.facebook_url
                ? 'https://www.facebook.com/<username>/'
                : data.facebook_url
            }
            onFocus={(e) => {
              e.target.value = 'https://www.facebook.com/'
            }}
            onBlur={(e) => {
              if (e.target.value === 'https://www.facebook.com/') {
                e.target.value = ''
              }
            }}
          />
          {formErrors.facebook && (
            <p className='text-red-500 text-sm mt-1'>{formErrors.facebook}</p>
          )}
        </div>

        <div>
          <Label className='text-sm font-semibold flex gap-2 items-center'>
            <Image
              src={InstagramLogo}
              width={32}
              height={32}
              alt='Instagram Logo'
              className='mr-2'
            />
            Instagram
          </Label>
          <Input
            value={form.instagram}
            onChange={(e) => {
              setForm({
                ...form,
                instagram: e.target.value,
              })
            }}
            placeholder={
              error || !data?.instagram_url
                ? 'https://www.instagram.com/<username>/'
                : data.instagram_url
            }
            onFocus={(e) => {
              e.target.value = 'https://www.instagram.com/'
            }}
            onBlur={(e) => {
              if (e.target.value === 'https://www.instagram.com/') {
                e.target.value = ''
              }
            }}
          />
          {formErrors.instagram && (
            <p className='text-red-500 text-sm mt-1'>{formErrors.instagram}</p>
          )}
        </div>

        <div>
          <Label className='text-sm font-semibold flex gap-2 items-center'>
            <Image
              src={LinkedInLogo}
              width={32}
              height={32}
              alt='LinkedIn Logo'
              className='mr-2'
            />
            LinkedIn
          </Label>
          <Input
            value={form.linkedin}
            onChange={(e) => {
              setForm({
                ...form,
                linkedin: e.target.value,
              })
            }}
            placeholder={
              error || !data?.linkedin_url
                ? 'https://www.linkedin.com/in/<username>/'
                : data.linkedin_url
            }
            onFocus={(e) => {
              e.target.value = 'https://www.linkedin.com/in/'
            }}
            onBlur={(e) => {
              if (e.target.value === 'https://www.linkedin.com/in/') {
                e.target.value = ''
              }
            }}
          />
          {formErrors.linkedin && (
            <p className='text-red-500 text-sm mt-1'>{formErrors.linkedin}</p>
          )}
        </div>

        <Button className='mx-4' type='submit'>
          {t('save')}
        </Button>
      </form>
    </div>
  )
}
