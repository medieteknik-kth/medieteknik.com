'use client'

import Logo from 'public/images/logo.png'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import FacebookSVG from 'public/images/svg/facebook.svg'
import InstagramSVG from 'public/images/svg/instagram.svg'
import LinkedInSVG from 'public/images/svg/linkedin.svg'

export default function AccountForm({
  params: { language },
}: {
  params: { language: string }
}) {
  const [profilePicturePreview, setProfilePicturePreview] =
    useState<File | null>(null)

  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles) return

    setProfilePicturePreview(selectedFiles[0])
  }

  const MAX_FILE_SIZE = 500 * 1024
  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  const AccountFormSchema = z.object({
    profilePicture: z.instanceof(window.File),
    emailTwo: z.string().email().optional().or(z.literal('')),
    emailThree: z.string().email().optional().or(z.literal('')),
    currentPassword: z
      .string({
        required_error: 'Password is required to edit account settings',
      })
      .min(8),
    newPassword: z.string().min(8).optional().or(z.literal('')),
  })

  const ProfileFormSchema = z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    emailNotifications: z.boolean(),
  })

  const accountForm = useForm<z.infer<typeof AccountFormSchema>>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues: {
      profilePicture: Logo as unknown as File,
      emailTwo: '',
      emailThree: '',
      currentPassword: '',
      newPassword: '',
    },
  })

  const profileForm = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      facebook: '',
      instagram: '',
      linkedin: '',
      emailNotifications: true,
    },
  })

  const postAccountForm = async (data: z.infer<typeof AccountFormSchema>) => {
    console.log(data)
  }

  const postProfileForm = async (data: z.infer<typeof ProfileFormSchema>) => {
    console.log(data)
  }

  return (
    <div className='w-full grid grid-cols-1 2xl:grid-cols-2'>
      <Form {...accountForm}>
        <div className='flex justify-center mb-8 2xl:mb-0'>
          <form
            className='w-2/3 flex flex-col *:py-2'
            onSubmit={accountForm.handleSubmit(postAccountForm)}
          >
            <h2 className='text-xl font-bold border-b border-yellow-400 mb-1'>
              Account Settings
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
                            : Logo.src
                        }
                        alt='Preview Profile Picture'
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      title='Contact an administrator to change your name'
                      value='André Eriksson'
                      readOnly
                      autoComplete='off'
                    />
                  </FormControl>
                  <FormDescription>Your full name</FormDescription>
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
                    <FormLabel>Emails</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        title='Contact an administrator to change your primary email '
                        value='andree4@kth.se'
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
                      Manage your accounts email for external services (e.g.
                      Notifications)
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='password'
                        placeholder='Current Password'
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
                    <FormControl>
                      <Input
                        {...field}
                        type='password'
                        placeholder='New Password'
                        autoComplete='new-password'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type='submit'>Save</Button>
          </form>
        </div>
      </Form>
      <Form {...profileForm}>
        <div className='flex justify-center mb-8 2xl:mb-0'>
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
                      placeholder='https://www.facebook.com/<username>/'
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
                      placeholder='https://www.instagram.com/<username>/'
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
                      placeholder='https://www.linkedin.com/in/<username>/'
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
            <FormField
              control={profileForm.control}
              name='emailNotifications'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='emailNotifications'>
                    Email Notifications
                  </FormLabel>
                  <FormControl>
                    <div className='flex place-items-center'>
                      <Checkbox
                        id='emailNotifications'
                        name='emailNotifications'
                        aria-label='Email Notifications'
                        role='checkbox'
                        defaultChecked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormDescription className='ml-2'>
                        Receive email notifications
                      </FormDescription>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Save</Button>
          </form>
        </div>
      </Form>
    </div>
  )
}
