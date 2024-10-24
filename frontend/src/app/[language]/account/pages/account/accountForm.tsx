'use client'

import getCroppedImg from '@/app/[language]/account/util/cropImage'
import { useTranslation } from '@/app/i18n/client'
import Loading from '@/components/tooltips/Loading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { accountSchema } from '@/schemas/user/account'
import { API_BASE_URL } from '@/utility/Constants'
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'
import { JSX, useMemo, useState } from 'react'
import Dropzone from 'react-dropzone'
import Cropper from 'react-easy-crop'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { z } from 'zod'

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

/**
 * @name AccountForm
 * @description The component that renders the account form, allowing the user to update their account settings
 *
 * @param {Props} props
 * @param {string} props.language - The language of the account form
 *
 * @returns {JSX.Element} The account form
 */
export default function AccountForm({ language }: Props): JSX.Element {
  // TODO: Improve the state management.
  // TODO: Split the form into smaller components.
  const { t } = useTranslation(language, 'account')
  const { student } = useAuthentication()
  const [profilePicturePreview, setProfilePicturePreview] =
    useState<File | null>()
  const [successfulProfilePictureUpload, setSuccessfulProfilePictureUpload] =
    useState(false)
  const [uploadImageDialogOpen, setUploadImageDialogOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string>('')

  const {
    data: csrf,
    error,
    isLoading,
  } = useSWR(`${API_BASE_URL}/csrf-token`, fetcher)

  const profilePreviewURL = useMemo(() => {
    if (!profilePicturePreview) return null
    return URL.createObjectURL(profilePicturePreview)
  }, [profilePicturePreview])

  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  const accountForm = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      profilePicture: Logo as unknown as File,
      emailTwo: '',
      emailThree: '',
      currentPassword: '',
      newPassword: '',
      csrf_token: '',
    },
  })

  if (error) return <div>Failed to load</div>
  if (!student) return <></> // TODO: Something better?
  if (isLoading) return <Loading language={language} />
  if (!csrf) return <Loading language={language} />

  const postAccountForm = async (data: z.infer<typeof accountSchema>) => {
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

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop)
  }

  const onCropComplete = (
    croppedArea: {
      x: number
      y: number
      width: number
      height: number
    },
    croppedAreaPixels: {
      x: number
      y: number
      width: number
      height: number
    }
  ) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const showCroppedImage = async () => {
    try {
      if (!profilePreviewURL) return
      if (!croppedAreaPixels) return
      const croppedImage = await getCroppedImg(
        profilePreviewURL,
        croppedAreaPixels,
        0
      )
      if (!croppedImage) return
      accountForm.setValue(
        'profilePicture',
        new File([croppedImage], 'profilePicture', {
          type: 'image/jpeg',
        })
      )
      setCroppedImage(croppedImage)
      setSuccessfulProfilePictureUpload(true)
    } catch (e) {
      console.error(e)
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

          <div className='flex mb-1'>
            <Avatar className='w-24 h-24 border-2 border-black'>
              <AvatarImage
                src={
                  croppedImage && successfulProfilePictureUpload
                    ? croppedImage
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
          <Dialog
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setProfilePicturePreview(null)
                setCrop({ x: 0, y: 0 })
                setZoom(1)
                setSuccessfulProfilePictureUpload(false)
                setUploadImageDialogOpen(false)
              } else {
                setUploadImageDialogOpen(true)
              }
            }}
            open={uploadImageDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant={'outline'}>
                {t('account_change_profile_picture')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('account_change_profile_picture')}</DialogTitle>
                <DialogDescription>
                  {t('account_change_profile_picture.description')}
                </DialogDescription>
              </DialogHeader>
              {profilePicturePreview && profilePreviewURL ? (
                <div className='flex flex-col gap-4'>
                  <div className='relative h-96'>
                    <Cropper
                      image={profilePreviewURL}
                      crop={crop}
                      zoom={zoom}
                      aspect={1 / 1}
                      cropShape='round'
                      onCropChange={onCropChange}
                      onCropComplete={onCropComplete}
                      onZoomChange={onZoomChange}
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Label>{t('account_change_profile_picture.zoom')}</Label>
                    <Slider
                      min={1}
                      max={3}
                      step={0.1}
                      value={[zoom]}
                      onValueChange={([newZoom]) => setZoom(newZoom)}
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Button
                      variant={'destructive'}
                      onClick={() => {
                        setProfilePicturePreview(null)
                      }}
                    >
                      {t('account_change_profile_picture.cancel')}
                    </Button>
                    <Button
                      onClick={() => {
                        showCroppedImage()
                        setUploadImageDialogOpen(false)
                      }}
                    >
                      {t('account_change_profile_picture.save')}
                    </Button>
                  </div>
                </div>
              ) : (
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    setProfilePicturePreview(acceptedFiles[0])
                  }}
                  accept={{
                    'image/jpeg': ['.jpeg', '.jpg'],
                    'image/png': ['.png'],
                    'image/webp': ['.webp'],
                  }}
                  maxSize={MAX_FILE_SIZE}
                  onDropRejected={(files) => {
                    const file = files[0]
                    if (file.errors[0].code === 'file-too-large') {
                      setUploadError(
                        t('account_change_profile_picture.error.large')
                      )
                    } else if (file.errors[0].code === 'file-invalid-type') {
                      setUploadError(
                        t('account_change_profile_picture.error.incorrect')
                      )
                    }
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      {uploadError && (
                        <p className='text-sm text-red-500'>{uploadError}</p>
                      )}
                      <input {...getInputProps()} />

                      <div
                        className='h-96 flex flex-col items-center justify-center gap-2 hover:!bg-neutral-200 dark:hover:!bg-neutral-800 rounded-md transition-colors cursor-pointer'
                        onDragEnter={(event) => {
                          // Check HTML element type class name for dark mode
                          if (
                            document.documentElement.classList.contains('dark')
                          ) {
                            event.currentTarget.style.backgroundColor =
                              '#262626'
                          } else {
                            event.currentTarget.style.backgroundColor =
                              '#E5E5E5'
                          }
                        }}
                        onDragLeave={(event) => {
                          if (
                            document.documentElement.classList.contains('dark')
                          ) {
                            event.currentTarget.style.backgroundColor =
                              '#0C0A09'
                          } else {
                            event.currentTarget.style.backgroundColor = 'white'
                          }
                        }}
                      >
                        <ArrowUpOnSquareIcon className='w-8 h-8' />
                        <p>
                          {t(
                            'account_change_profile_picture.upload_profile_picture'
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            </DialogContent>
          </Dialog>
          <FormField
            name='profilePicture'
            render={({ field }) => (
              <FormItem className='flex flex-col justify-around'>
                <FormControl>
                  <Input
                    type='hidden'
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
                      type='hidden'
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
                      type='hidden'
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
          <div className='flex flex-col lg:flex-row lg:*:w-1/2'>
            <FormField
              control={accountForm.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem className='pr-2'>
                  <FormLabel>{t('account_password')}</FormLabel>
                  <FormDescription className='h-10'>
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
                <FormItem className='lg:pl-2 mt-2 lg:mt-8'>
                  <FormDescription className='min-h-10'>
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
