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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import type { LanguageCode } from '@/models/Language'
import {
  useAuthentication,
  useStudent,
} from '@/providers/AuthenticationProvider'
import { receptionSchema } from '@/schemas/user/reception'
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'
import { type JSX, useEffect, useMemo, useState } from 'react'
import Dropzone from 'react-dropzone'
import Cropper from 'react-easy-crop'
import useSWR from 'swr'
import { z } from 'zod/v4-mini'

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
 * @name ReceptionForm
 * @description The component that renders the reception form, allowing the user to update their reception (mottagning) settings
 *
 * @param {Props} props
 * @param {string} props.language - The language of the reception form
 *
 * @returns {JSX.Element} The reception form
 */
export default function ReceptionForm({ language }: Props): JSX.Element {
  const { setStale } = useAuthentication()
  const { student } = useStudent()
  const [csrfToken, setCsrfToken] = useState<string | null>()
  const { t } = useTranslation(language, 'account/reception')
  const [receptionPicturePreview, setReceptionPicturePreview] = useState<
    File | undefined
  >(undefined)
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
  const [form, setForm] = useState<z.infer<typeof receptionSchema>>({
    image: undefined,
    receptionName: student?.reception_name || '',
    csrf_token: '',
  })
  const [formErrors, setFormErrors] = useState({
    image: '',
    receptionName: '',
    csrf_token: '',
  })

  const receptionPicturePreviewURL = useMemo(() => {
    if (!receptionPicturePreview) return null
    return URL.createObjectURL(receptionPicturePreview)
  }, [receptionPicturePreview])

  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  const { data: csrf, error, isLoading } = useSWR('/api/csrf-token', fetcher)

  useEffect(() => {
    if (csrf) {
      setCsrfToken(csrf.token)
      setForm({
        ...form,
        csrf_token: csrf.token,
      })
    }
  }, [csrf, form])

  if (!student) return <></> // TODO: Something better?
  if (error) return <div>Failed to load</div>
  if (isLoading) return <Loading language={language} />
  if (!csrf) return <Loading language={language} />

  const submit = async (data: z.infer<typeof receptionSchema>) => {
    const errors = receptionSchema.safeParse(data)
    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        image: fieldErrors.properties?.image?.errors[0] || '',
        receptionName: fieldErrors.properties?.receptionName?.errors[0] || '',
        csrf_token: fieldErrors.properties?.csrf_token?.errors[0] || '',
      })
      return
    }

    const formData = new FormData()

    if (data.image) {
      formData.append('reception_image', data.image)
    }
    formData.append('reception_name', data.receptionName || '')
    formData.append('csrf_token', data.csrf_token || csrf.token)

    try {
      const response = await fetch('/api/students/reception', {
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
      setStale(true)
      window.location.reload()
    } catch (error) {
      alert('Failed to save')
      console.error(error)
      return
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
      if (!receptionPicturePreviewURL) return
      if (!croppedAreaPixels) return
      const croppedImage = await getCroppedImg(
        receptionPicturePreviewURL,
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
      setForm({
        ...form,
        image: newFile,
      })
      setCroppedImage(croppedImage)
      setSuccessfulProfilePictureUpload(true)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className='w-full max-w-[1100px] flex mb-8 2xl:mb-0'>
      <form
        className='w-full flex flex-col gap-4 max-h-[725px] overflow-y-auto overflow-x-visible'
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

        <div className='flex flex-col gap-2 px-4'>
          <div className='flex gap-2'>
            <div className='w-24 h-24 border border-black rounded-full overflow-hidden bg-white'>
              <Image
                src={
                  croppedImage && successfulProfilePictureUpload
                    ? croppedImage
                    : student.reception_profile_picture_url || Logo.src
                }
                alt='Preview Profile Picture'
                width={student.reception_profile_picture_url ? 256 : 96}
                height={student.reception_profile_picture_url ? 256 : 96}
              />
            </div>
            <div className='flex flex-col justify-center'>
              <Label className='w-fit text-sm font-semibold'>
                {t('profile_picture')}
              </Label>
              <p className='max-w-min xs:max-w-none text-xs text-muted-foreground'>
                {t('profile_picture_requirements')}
              </p>
            </div>
          </div>

          <Dialog
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setReceptionPicturePreview(undefined)
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
              <Button variant={'outline'}>{t('change_profile_picture')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('change_profile_picture')}</DialogTitle>
                <DialogDescription>
                  {t('change_profile_picture.description')}
                </DialogDescription>
              </DialogHeader>
              {receptionPicturePreview && receptionPicturePreviewURL ? (
                <div className='flex flex-col gap-4'>
                  <div className='relative h-96'>
                    <Cropper
                      image={receptionPicturePreviewURL}
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
                    <Label>{t('change_profile_picture.zoom')}</Label>
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
                        setReceptionPicturePreview(undefined)
                      }}
                    >
                      {t('change_profile_picture.cancel')}
                    </Button>
                    <Button
                      onClick={() => {
                        showCroppedImage()
                        setUploadImageDialogOpen(false)
                      }}
                    >
                      {t('change_profile_picture.save')}
                    </Button>
                  </div>
                </div>
              ) : (
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    setReceptionPicturePreview(acceptedFiles[0])
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
                      setUploadError(t('change_profile_picture.error.large'))
                    } else if (file.errors[0].code === 'file-invalid-type') {
                      setUploadError(
                        t('change_profile_picture.error.incorrect')
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
                          {t('change_profile_picture.upload_profile_picture')}
                        </p>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            </DialogContent>
          </Dialog>

          <div>
            <Label className='text-sm font-semibold'>
              {t('reception_name')}
            </Label>
            <p className='text-xs text-muted-foreground'>
              {t('reception_name_description')}
            </p>
            <Input
              id='reception_name'
              value={form.receptionName}
              onChange={(e) => {
                setForm({
                  ...form,
                  receptionName: e.target.value,
                })
              }}
              placeholder={
                student.reception_name
                  ? student.reception_name
                  : t('reception_name.placeholder')
              }
            />
            {formErrors.receptionName && (
              <p className='text-red-500 text-sm mt-1'>
                {formErrors.receptionName}
              </p>
            )}
          </div>
        </div>

        <Button
          type='submit'
          className='mx-4'
          onClick={() => {
            setForm({
              ...form,
              csrf_token: csrf.token || '',
            })
          }}
        >
          {t('save')}
        </Button>
      </form>
    </div>
  )
}
