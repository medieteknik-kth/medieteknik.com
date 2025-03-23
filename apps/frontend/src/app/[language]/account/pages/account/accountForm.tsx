'use client'

import getCroppedImg from '@/app/[language]/account/util/cropImage'
import { useTranslation } from '@/app/i18n/client'
import Loading from '@/components/tooltips/Loading'
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
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import type { LanguageCode } from '@/models/Language'
import {
  useAuthentication,
  useStudent,
} from '@/providers/AuthenticationProvider'
import { accountSchema } from '@/schemas/user/account'
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'
import { type JSX, useMemo, useState } from 'react'
import Dropzone from 'react-dropzone'
import Cropper from 'react-easy-crop'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import type { z } from 'zod'

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
  language: LanguageCode
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
  const { t } = useTranslation(language, 'account/account_settings')
  const { setStale } = useAuthentication()
  const { student } = useStudent()
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

  const { data: csrf, error, isLoading } = useSWR('/api/csrf-token', fetcher)

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

  if (!student) return <></> // TODO: Something better?
  if (error) return <div>Failed to load</div>
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
      const response = await fetch('/api/students/', {
        method: 'PUT',
        headers: {
          'X-CSRF-Token': data.csrf_token || csrf.token,
        },
        credentials: 'include',
        body: formData,
      })

      if (response.ok) {
        setStale(true)
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
      const response = await fetch(croppedImage)
      const blob = await response.blob()
      const extension = blob.type.split('/')[1]
      const newFile = new File([blob], `${student.student_id}.${extension}`, {
        type: blob.type,
      })
      accountForm.setValue('profilePicture', newFile)
      setCroppedImage(croppedImage)
      setSuccessfulProfilePictureUpload(true)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Form {...accountForm}>
      <div className='w-full max-w-[1100px] flex mb-8 2xl:mb-0'>
        <form
          className='w-full flex flex-col gap-4 max-h-[725px] overflow-y-auto'
          onSubmit={accountForm.handleSubmit(postAccountForm)}
        >
          <div className='w-full mb-4 px-4 pt-4'>
            <h2 className='text-lg font-bold'>{t('title')}</h2>
            <p className='text-sm text-muted-foreground'>{t('description')}</p>
            <Separator className='bg-yellow-400 mt-4' />
          </div>

          <div className='flex flex-col gap-2 px-4'>
            <div className='flex gap-2'>
              <div className='w-24 h-24 border border-black rounded-full overflow-hidden bg-white'>
                <Image
                  src={
                    croppedImage && successfulProfilePictureUpload
                      ? croppedImage
                      : student.profile_picture_url || Logo.src
                  }
                  alt='Preview Profile Picture'
                  width={student.profile_picture_url ? 256 : 96}
                  height={student.profile_picture_url ? 256 : 96}
                />
              </div>
              <div className='flex flex-col justify-center'>
                <FormLabel className='text-sm font-semibold'>
                  {t('account_profile_picture')}
                </FormLabel>
                <FormDescription className='max-w-min xs:max-w-none text-xs text-muted-foreground'>
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
                  <DialogTitle>
                    {t('account_change_profile_picture')}
                  </DialogTitle>
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
                          className='h-96 flex flex-col items-center justify-center gap-2 hover:bg-neutral-200! dark:hover:bg-neutral-800! rounded-md transition-colors cursor-pointer'
                          onDragEnter={(event) => {
                            // Check HTML element type class name for dark mode
                            if (
                              document.documentElement.classList.contains(
                                'dark'
                              )
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
                              document.documentElement.classList.contains(
                                'dark'
                              )
                            ) {
                              event.currentTarget.style.backgroundColor =
                                '#0C0A09'
                            } else {
                              event.currentTarget.style.backgroundColor =
                                'white'
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
                        const file_url = URL.createObjectURL(
                          new Blob([file], { type: file.type })
                        )
                        img.src = file_url
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
                          URL.revokeObjectURL(file_url)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name='name'
            disabled
            render={({ field }) => (
              <FormItem className='px-4'>
                <FormLabel className='text-sm font-semibold'>
                  {t('account_name')}
                </FormLabel>
                <FormDescription className='text-xs text-muted-foreground'>
                  {t('account_name_description')}
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    title={t('account_name_change')}
                    value={`${student.first_name} ${student.last_name || ''}`}
                    readOnly
                    autoComplete='off'
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-col px-4'>
            <FormField
              name='emailOne'
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold'>
                    {t('account_email')}
                  </FormLabel>
                  <FormDescription className='text-xs text-muted-foreground'>
                    {t('account_email_description')}
                  </FormDescription>
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
          </div>

          <div className='grid grid-cols-1 gap-2 lg:grid-cols-2 px-4'>
            <FormField
              control={accountForm.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem className='pr-2'>
                  <FormLabel className='text-sm font-semibold'>
                    {t('account_password')}
                  </FormLabel>
                  <FormDescription className='text-xs text-muted-foreground'>
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
                <FormItem className='self-end'>
                  <FormDescription className='text-xs text-muted-foreground'>
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
            className='mx-4'
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
