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
import ProfileForm from './profileForm'

const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then(
    (res) =>
      res.json() as Promise<{
        token: string
      }>
  )

interface Props {
  language: string
}

export default function AccountForm({ language }: Props) {
  const { t } = useTranslation(language, 'account')
  const { student } = useAuthentication()
  const [profilePicturePreview, setProfilePicturePreview] =
    useState<File | null>()

  if (!student) return null
  const {
    data: csrf,
    error,
    isLoading,
  } = useSWR(`${API_BASE_URL}/csrf-token`, fetcher)

  if (error) return <div>Failed to load</div>

  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  const AccountFormSchema = z.object({
    profilePicture: z.instanceof(window.File).optional().or(z.literal('')),
    emailTwo: z.string().email().optional().or(z.literal('')),
    emailThree: z.string().email().optional().or(z.literal('')),
    currentPassword: z.string().min(3).optional().or(z.literal('')),
    newPassword: z
      .string()
      .min(8)
      .optional()
      .or(z.literal(''))
      .refine(
        (value) => {
          if (!value) return true
          // At least one number
          if (!/[0-9]/.test(value)) return false
          // At least one lowercase character
          if (!/[a-z]/.test(value)) return false
          // At least one uppercase character
          if (!/[A-Z]/.test(value)) return false
          // At least one special character
          if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) return false
          return true
        },
        {
          message:
            'Password must be at least 8 characters, with at least one number, one uppercase character, one lowercase character, and one special character',
        }
      ),
    csrf_token: z.string().optional().or(z.literal('')),
  })

  const accountForm = useForm<z.infer<typeof AccountFormSchema>>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues: {
      profilePicture: Logo as unknown as File,
      emailTwo: '',
      emailThree: '',
      currentPassword: '',
      newPassword: '',
      csrf_token: '',
    },
  })

  if (isLoading) return <Loading language={language} />
  if (!csrf) return null

  const postAccountForm = async (data: z.infer<typeof AccountFormSchema>) => {
    const formData = new FormData()

    if (
      !data.profilePicture &&
      !data.emailTwo &&
      !data.emailThree &&
      !data.currentPassword &&
      !data.newPassword
    ) {
      alert('No changes were made')
      return
    }

    if (data.profilePicture)
      formData.append('profile_picture', data.profilePicture)
    if (data.emailTwo) formData.append('email_two', data.emailTwo)
    if (data.emailThree) formData.append('email_three', data.emailThree)
    if (data.currentPassword)
      formData.append('current_password', data.currentPassword)
    if (data.newPassword) formData.append('new_password', data.newPassword)
    formData.append('csrf_token', data.csrf_token || csrf.token)

    try {
      const response = await fetch(`${API_BASE_URL}/students/`, {
        method: 'PUT',
        headers: {
          'X-CSRF-Token': data.csrf_token || csrf.token,
        },
        credentials: 'include',
        body: formData,
      })

      if (response.ok) {
        location.reload()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...accountForm}>
      <div className='flex justify-center mb-8 2xl:mb-0'>
        <form
          className='w-2/3 flex flex-col *:py-2'
          onSubmit={accountForm.handleSubmit(postAccountForm)}
        >
          <h2 className='text-xl font-bold border-b border-yellow-400 mb-1'>
            {t('tab_account_settings')}
          </h2>
          <FormField
            name='profilePicture'
            render={({ field }) => (
              <FormItem className='flex flex-col justify-around'>
                <div className='flex mb-1'>
                  <Avatar className='w-24 h-24 border-2 border-black'>
                    <AvatarImage
                      src={
                        profilePicturePreview
                          ? URL.createObjectURL(profilePicturePreview)
                          : student.profile_picture_url
                      }
                      alt='Preview Profile Picture'
                    />
                    <AvatarFallback>
                      <Image src={Logo} alt='Logo' width={96} height={96} />
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col justify-center ml-2'>
                    <FormLabel className='pb-1'>
                      {t('account_profile_picture')}
                    </FormLabel>
                    <FormDescription>
                      {t('account_profile_picture_requirements')}
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

                      const img = new window.Image()
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
                        setProfilePicturePreview(file)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='name'
            disabled
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('account_name')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    title='Contact an administrator to change your name'
                    value={student.first_name + ' ' + (student.last_name || '')}
                    readOnly
                    autoComplete='off'
                  />
                </FormControl>
                <FormDescription>
                  {t('account_name_description')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-col *:py-1'>
            <FormField
              name={`emailOne`}
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account_email')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      title='Contact an administrator to change your primary email '
                      value={student.email}
                      readOnly
                      autoComplete='off'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={accountForm.control}
              name={`emailTwo`}
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Second Email (optional)'
                      title='This email is optional'
                      autoComplete='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={accountForm.control}
              name={`emailThree`}
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Third Email (optional)'
                      title='This email is optional'
                      autoComplete='email'
                    />
                  </FormControl>
                  <FormDescription>
                    {t('account_email_description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex *:w-1/2'>
            <FormField
              control={accountForm.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem className='pr-2'>
                  <FormLabel>{t('account_password')}</FormLabel>
                  <FormDescription>
                    {t('account_current_password_description')}
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      placeholder={t('account_current_password')}
                      autoComplete='current-password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={accountForm.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem className='pl-2 mt-8'>
                  <FormDescription>
                    {t('account_new_password_description')}
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      placeholder={t('account_new_password')}
                      autoComplete='new-password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name='csrf_token'
            render={({ field }) => <input type='hidden' {...field} />}
          />

          <Button
            type='submit'
            onClick={() => {
              accountForm.setValue('csrf_token', csrf.token)
            }}
          >
            {t('save_changes')}
          </Button>
        </form>
      </div>
    </Form>
  )
}
