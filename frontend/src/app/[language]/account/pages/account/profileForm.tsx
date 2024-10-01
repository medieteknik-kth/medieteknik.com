'use client'

import Logo from 'public/images/logo.webp'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import FacebookSVG from 'public/images/svg/facebook.svg'
import InstagramSVG from 'public/images/svg/instagram.svg'
import LinkedInSVG from 'public/images/svg/linkedin.svg'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import Image from 'next/image'
import { API_BASE_URL } from '@/utility/Constants'
import useSWR from 'swr'
import Loading from '@/components/tooltips/Loading'
import { useTranslation } from '@/app/i18n/client'
import { Profile } from '@/models/Student'

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json() as Promise<Profile>)

interface Props {
  language: string
}

export default function ProfileForm({ language }: Props) {
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/students/profile`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshWhenHidden: false,
      shouldRetryOnError: false,
    }
  )

  const ProfileFormSchema = z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
  })

  const profileForm = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      facebook: '',
      instagram: '',
      linkedin: '',
    },
  })
  if (isLoading) return <Loading language={language} />

  const postProfileForm = async (data: z.infer<typeof ProfileFormSchema>) => {
    try {
      const json_data = {
        facebook_url: data.facebook === '' ? null : data.facebook,
        instagram_url: data.instagram === '' ? null : data.instagram,
        linkedin_url: data.linkedin === '' ? null : data.linkedin,
      }

      console.log(json_data)

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
      <div className='flex justify-center mb-8 2xl:mb-0 relative'>
        <div className='z-50 bg-neutral-300/75 absolute w-full h-full grid place-items-center'>
          <p className='text-xl font-bold'>TO BE ADDED</p>
        </div>

        <form
          className='w-2/3 flex flex-col *:py-2'
          onSubmit={profileForm.handleSubmit(postProfileForm)}
        >
          <h2 className='text-xl font-bold border-b border-yellow-400 mb-1'>
            Profile Settings
          </h2>
          <FormField
            control={profileForm.control}
            name='facebook'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center'>
                  <FacebookSVG className='w-6 h-6 mr-2 dark:fill-white' />
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
              <FormItem>
                <FormLabel className='flex items-center'>
                  <InstagramSVG className='w-6 h-6 mr-2 dark:fill-white' />
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
              <FormItem>
                <FormLabel className='flex items-center dark:fill-white'>
                  <LinkedInSVG className='w-6 h-6 mr-2' />
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

          <Button type='submit'>Save</Button>
        </form>
      </div>
    </Form>
  )
}
