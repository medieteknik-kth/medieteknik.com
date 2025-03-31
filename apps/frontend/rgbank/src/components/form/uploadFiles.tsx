'use client'

import { Button } from '@/components/ui/button'
import FileDisplay from '@/components/ui/file-display'
import { toast } from '@/components/ui/use-toast'
import { useFiles, useGeneralForm } from '@/providers/FormProvider'
import { ArrowUpOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Dropzone from 'react-dropzone'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const acceptedImages = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/avif': ['.avif'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
}

interface Props {
  fileUploadStep: number
  uncompleteStep: (step: number) => void
  completeStep: (step: number) => void
  setIsDigitalReceiptRequired?: (isRequired: boolean) => void
}

export default function UploadFiles({
  fileUploadStep,
  uncompleteStep,
  completeStep,
  setIsDigitalReceiptRequired,
}: Props) {
  const { files, removeFile, addFile } = useFiles()
  const { error, setError } = useGeneralForm()

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
                `File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
              )
              uncompleteStep(fileUploadStep)
              return
            }
            if (file.name.endsWith('.pdf')) {
              if (setIsDigitalReceiptRequired) {
                uncompleteStep(2)
                setIsDigitalReceiptRequired(true)
              }
            }
            toast({
              title: 'File uploaded successfully',
              style: {
                backgroundColor: 'green',
                color: 'white',
                borderRadius: '0.5rem',
              },
              description: `File ${file.name} uploaded successfully`,
              duration: 2000,
            })
            addFile(file)
            completeStep(fileUploadStep)
            setError('')
          }
        }}
        onDropRejected={(files) => {
          for (const file of files) {
            if (file.errors[0].code === 'file-invalid-type') {
              setError('Invalid file type. Please upload a valid image.')
            } else if (file.errors[0].code === 'file-too-large') {
              setError(
                `File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
              )
            }

            removeFile(file.file)

            if (files.length === 0) {
              uncompleteStep(fileUploadStep)
            }

            toast({
              title: 'File upload failed',
              style: {
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '0.5rem',
              },
              description: `File ${file.file.name} upload failed`,
              duration: 2000,
            })
          }
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            {error && <p className='text-red-500'>{error}</p>}
            <input {...getInputProps()} />
            <div className='h-96 flex flex-col items-center justify-center gap-2 hover:bg-neutral-200! dark:hover:bg-neutral-800! rounded-md transition-colors cursor-pointer border-2 border-dashed border-neutral-300 dark:border-neutral-700'>
              <ArrowUpOnSquareIcon className='w-8 h-8' />
              <p className='text-sm text-center text-muted-foreground'>
                Drag and drop your file here, or click to select a file.
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
                        completeStep(2)
                      }
                    }
                  }
                  toast({
                    title: 'File removed',
                    description: `File ${file.name} removed successfully`,
                    duration: 2000,
                  })
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
