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
import { Profile } from '@/models/Student'
import { profileSchema } from '@/schemas/user/profile'
import { API_BASE_URL } from '@/utility/Constants'
import { zodResolver } from '@hookform/resolvers/zod'
import FacebookSVG from 'public/images/svg/facebook.svg'
import InstagramSVG from 'public/images/svg/instagram.svg'
import LinkedInSVG from 'public/images/svg/linkedin.svg'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { z } from 'zod'

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => res.json() as Promise<Profile>)

interface Props {
  language: string
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
      <div className='flex justify-center mb-8 2xl:mb-0 relative'>
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
