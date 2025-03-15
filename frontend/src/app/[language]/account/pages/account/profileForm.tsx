'use client'
import Loading from '@/components/tooltips/Loading'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { Profile } from '@/models/Student'
import { profileSchema } from '@/schemas/user/profile'
import { API_BASE_URL } from '@/utility/Constants'
import { zodResolver } from '@hookform/resolvers/zod'
import FacebookLogo from 'public/images/logos/Facebook_Logo_Primary.png'
import InstagramLogo from 'public/images/logos/Instagram_Glyph_Gradient.png'
import LinkedInLogo from 'public/images/logos/LI-In-Bug.png'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import type { z } from 'zod'

import { useTranslation } from '@/app/i18n/client'
import { Separator } from '@/components/ui/separator'
import type { LanguageCode } from '@/models/Language'
import Image from 'next/image'
import type { JSX } from 'react'

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
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/students/profile`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshWhenHidden: false,
      shouldRetryOnError: false,
    }
  )

  const { t } = useTranslation(language, 'account/profile')

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      facebook: '',
      instagram: '',
      linkedin: '',
    },
  })
  if (isLoading) return <Loading language={language} />

  const postProfileForm = async (data: z.infer<typeof profileSchema>) => {
    try {
      const json_data = {
        facebook_url: data.facebook === '' ? null : data.facebook,
        instagram_url: data.instagram === '' ? null : data.instagram,
        linkedin_url: data.linkedin === '' ? null : data.linkedin,
      }

      const response = await fetch(`${API_BASE_URL}/students/profile`, {
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
    <Form {...profileForm}>
      <div className='w-full max-w-[1100px] flex mb-8 2xl:mb-0'>
        <form
          className='w-full flex flex-col gap-4 max-h-[725px] overflow-y-auto'
          onSubmit={profileForm.handleSubmit(postProfileForm)}
        >
          <div className='w-full mb-4 px-4 pt-4'>
            <h2 className='text-lg font-bold'>{t('title')}</h2>
            <p className='text-sm text-muted-foreground'>{t('description')}</p>
            <Separator className='bg-yellow-400 mt-4' />
          </div>
          <FormField
            control={profileForm.control}
            name='facebook'
            render={({ field }) => (
              <FormItem className='px-4'>
                <FormLabel className='text-sm font-semibold flex gap-2 items-center'>
                  <Image
                    src={FacebookLogo}
                    width={32}
                    height={32}
                    alt='Facebook Logo'
                  />
                  Facebook
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name='instagram'
            render={({ field }) => (
              <FormItem className='px-4'>
                <FormLabel className='text-sm font-semibold flex gap-2 items-center'>
                  <Image
                    src={InstagramLogo}
                    width={32}
                    height={32}
                    alt='Instagram Logo'
                    className='mr-2'
                  />
                  Instagram
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name='linkedin'
            render={({ field }) => (
              <FormItem className='px-4'>
                <FormLabel className='text-sm font-semibold flex gap-2 items-center'>
                  <Image
                    src={LinkedInLogo}
                    width={38}
                    height={32}
                    alt='LinkedIn Logo'
                    className='mr-2'
                  />
                  LinkedIn
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className='mx-4' type='submit'>
            {t('save')}
          </Button>
        </form>
      </div>
    </Form>
  )
}
