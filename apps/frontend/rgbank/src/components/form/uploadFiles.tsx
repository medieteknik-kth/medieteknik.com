'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import FileDisplay from '@/components/ui/file-display'
import { useFiles, useGeneralForm } from '@/providers/FormProvider'
import { ArrowUpOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { useState } from 'react'
import Dropzone from 'react-dropzone'
import { toast } from 'sonner'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const acceptedImages = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/avif': ['.avif'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
}

interface Props {
  language: LanguageCode
  fileUploadStep: number
  uncompleteStep: (step: number) => void
  completeStep: (step: number) => void
  setIsDigitalReceiptRequired?: (isRequired: boolean) => void
  ariaLabelledby?: string
  ariaDescribedby?: string
}

export default function UploadFiles({
  language,
  fileUploadStep,
  uncompleteStep,
  completeStep,
  setIsDigitalReceiptRequired,
  ariaLabelledby,
  ariaDescribedby,
}: Props) {
  const { files, removeFile, addFile } = useFiles()
  const { setError: setFormError } = useGeneralForm()
  const [error, setError] = useState('')
  const { t } = useTranslation(language, 'upload/file')

  return (
    <>
      <Dropzone
        accept={acceptedImages}
        maxFiles={5}
        maxSize={MAX_FILE_SIZE}
        onDropAccepted={(files) => {
          for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
              setError(
                t('error.file.too_large', {
                  maxSize: MAX_FILE_SIZE / 1024 / 1024,
                })
              )
              uncompleteStep(fileUploadStep)
              return
            }
            if (file.name.endsWith('.pdf')) {
              if (setIsDigitalReceiptRequired) {
                uncompleteStep(3)
                setIsDigitalReceiptRequired(true)
              }
            }
            toast.success(t('success'))
            addFile(file)
            completeStep(fileUploadStep)
          }
          setError('')
        }}
        onDropRejected={(files) => {
          for (const file of files) {
            if (file.errors[0].code === 'file-invalid-type') {
              setError(
                t('error.file.invalid_format', {
                  validFormats: 'jpeg, jpg, png, avif, webp, pdf',
                })
              )

              setFormError(
                t('error.file.invalid_format', {
                  validFormats: 'jpeg, jpg, png, avif, webp, pdf',
                })
              )
            } else if (file.errors[0].code === 'file-too-large') {
              setError(
                t('error.file.too_large', {
                  maxSize: MAX_FILE_SIZE / 1024 / 1024,
                })
              )
              setFormError(
                t('error.file.too_large', {
                  maxSize: MAX_FILE_SIZE / 1024 / 1024,
                })
              )
            }

            removeFile(file.file)

            if (files.length === 0) {
              uncompleteStep(fileUploadStep)
            }

            toast.error(t('error.file.upload_failed'))
          }
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            {error && <p className='text-red-500'>{error}</p>}
            <input
              {...getInputProps()}
              name='files'
              role='textbox'
              aria-labelledby={ariaLabelledby}
              aria-describedby={ariaDescribedby}
              title='Upload files'
            />
            <div className='h-96 flex flex-col items-center justify-center gap-2 hover:bg-neutral-200! dark:hover:bg-neutral-800! rounded-md transition-colors cursor-pointer border-2 border-dashed border-neutral-300 dark:border-neutral-700'>
              <ArrowUpOnSquareIcon className='w-8 h-8' />
              <p className='text-sm text-center text-muted-foreground px-2'>
                {t('label.upload')}
              </p>
            </div>
          </div>
        )}
      </Dropzone>
      <ul className='flex flex-wrap mt-2 gap-2'>
        {files && (
          <FileDisplay files={files} preview>
            {(file) => (
              <Button
                className='cursor-pointer'
                size={'icon'}
                variant={'ghost'}
                onClick={() => {
                  removeFile(file)
                  if (files.length === 1) {
                    uncompleteStep(fileUploadStep)
                  }
                  setError('')
                  if (file.name.endsWith('.pdf')) {
                    if (setIsDigitalReceiptRequired) {
                      setIsDigitalReceiptRequired(false)
                      if (files.length === 1) {
                        completeStep(3)
                      }
                    }
                  }

                  toast(t('file.removed'))
                }}
                disabled={!file}
              >
                <XMarkIcon className='w-4 h-4' />
              </Button>
            )}
          </FileDisplay>
        )}
      </ul>
    </>
  )
}
