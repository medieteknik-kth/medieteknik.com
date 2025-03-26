'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from '@/components/ui/use-toast'
import type Committee from '@/models/Committee'
import {
  ArrowUpOnSquareIcon,
  CheckIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'
import { useCallback, useState } from 'react'
import Dropzone from 'react-dropzone'

interface Props {
  committees: Committee[]
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const calculateFileSize = (size: number) => {
  // Convert bytes to KB, MB, GB, etc.
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let fileSize = size
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }
  return `${fileSize.toFixed(2)} ${units[unitIndex]}`
}

export default function Expense({ committees }: Props) {
  const [errorMessage, setErrorMessage] = useState('')
  const [completedSteps, setCompletedSteps] = useState([
    false,
    false,
    true,
    false,
  ])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  let categoryIndex = 0
  const [categories, setCategories] = useState([
    {
      id: 0,
      author: '',
      category: '',
      type: '',
      amount: 0,
    },
  ])
  const [dropdownOpen, setDropdownOpen] = useState(-1) // -1 = none, i = index of the dropdown open
  const [isDigitalReceiptRequired, setIsDigitalReceiptRequired] =
    useState(false)

  const completeStep = useCallback((step: number) => {
    setCompletedSteps((prev) => {
      const newSteps = [...prev]
      newSteps[step] = true
      return newSteps
    })
  }, [])

  const uncompleteStep = useCallback((step: number) => {
    setCompletedSteps((prev) => {
      const newSteps = [...prev]
      newSteps[step] = false
      return newSteps
    })
  }, [])

  const addCategory = useCallback(() => {
    categoryIndex++
    setCategories((prev) => [
      ...prev,
      {
        id: categoryIndex,
        author: '',
        category: '',
        type: '',
        amount: 0,
      },
    ])
  }, [categoryIndex])

  const acceptedImages = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/avif': ['.avif'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf'],
  }

  const allCommittees = [
    ...committees.map((committee) => ({
      value: committee.committee_id,
      label: committee.translations[0].title,
      icon: committee.logo_url,
    })),
  ]

  return (
    <>
      <div>
        <p className='text-center text-sm text-muted-foreground'>
          Fill in the details of your expense.
        </p>
        <h1 className='text-3xl font-bold text-center'>Expense</h1>
      </div>
      <div className='flex flex-col gap-4 mt-8'>
        <div>
          <div className='flex items-center gap-4 pb-2'>
            <div className='w-8 h-8 border rounded-full'>
              {completedSteps[0] ? (
                <CheckIcon className='w-8 h-8 bg-green-400/70 rounded-full p-1.5' />
              ) : (
                <XMarkIcon className='w-8 h-8 bg-red-400/70 rounded-full p-1.5' />
              )}
            </div>
            <div>
              <h2 className='text-lg font-bold leading-5'>
                Step 1: Upload your receipt image. <br />
              </h2>
              <p className='text-sm text-muted-foreground'>
                (PDF, PNG, JPG, JPEG, AVIF)
              </p>
            </div>
          </div>
          <Dropzone
            accept={acceptedImages}
            maxFiles={1}
            maxSize={MAX_FILE_SIZE}
            onDropAccepted={(files) => {
              const file = files[0]
              if (file.size > MAX_FILE_SIZE) {
                setErrorMessage(
                  `File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
                )
                uncompleteStep(0)
                return
              }
              if (file.name.endsWith('.pdf')) {
                uncompleteStep(2)
                setIsDigitalReceiptRequired(true)
              }
              toast({
                title: 'File uploaded successfully',
                description: `File ${file.name} uploaded successfully`,
                duration: 2000,
              })
              setUploadedFile(file)
              completeStep(0)
              setErrorMessage('')
            }}
            onDropRejected={(files) => {
              const file = files[0]
              uncompleteStep(0)
              setUploadedFile(null)
              if (file.errors[0].code === 'file-invalid-type') {
                setErrorMessage(
                  'Invalid file type. Please upload a valid image.'
                )
              } else if (file.errors[0].code === 'file-too-large') {
                setErrorMessage(
                  `File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
                )
              }
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
                <input {...getInputProps()} />
                <div className='h-96 flex flex-col items-center justify-center gap-2 hover:bg-neutral-200! dark:hover:bg-neutral-800! rounded-md transition-colors cursor-pointer border-2 border-dashed border-neutral-300 dark:border-neutral-700'>
                  <ArrowUpOnSquareIcon className='w-8 h-8' />
                  <p>
                    Drag and drop your file here, or click to select a file.
                  </p>
                </div>
              </div>
            )}
          </Dropzone>
          {uploadedFile && (
            <div className='py-2 mt-2 border rounded-md w-[33rem] px-4 flex items-center justify-between gap-2 bg-neutral-200 dark:bg-neutral-800'>
              <div className='flex items-center gap-2'>
                {uploadedFile.name.endsWith('.pdf') ? (
                  <DocumentTextIcon className='w-8 h-8 text-red-500' />
                ) : (
                  <PhotoIcon className='w-8 h-8 text-blue-500' />
                )}

                <div>
                  <p className='text-sm'>{uploadedFile.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {calculateFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>

              <Button
                className='cursor-pointer'
                size={'icon'}
                variant={'ghost'}
                onClick={() => {
                  setUploadedFile(null)
                  setErrorMessage('')
                  uncompleteStep(0)
                  setIsDigitalReceiptRequired(false)
                  toast({
                    title: 'File removed',
                    description: `File ${uploadedFile.name} removed successfully`,
                    duration: 2000,
                  })
                }}
                disabled={!uploadedFile}
              >
                <XMarkIcon className='w-4 h-4' />
              </Button>
            </div>
          )}
        </div>

        <div>
          <div className='flex items-center gap-4 pb-2'>
            <div className='w-8 h-8 border rounded-full'>
              {completedSteps[1] ? (
                <CheckIcon className='w-8 h-8 bg-green-400/70 rounded-full p-1.5' />
              ) : (
                <XMarkIcon className='w-8 h-8 bg-red-400/70 rounded-full p-1.5' />
              )}
            </div>
            <div>
              <h2 className='text-lg font-bold leading-5'>
                Step 2: Enter in the date of the expense. <br />
              </h2>
              <p className='text-sm text-muted-foreground'>
                (Date must be in the past)
              </p>
            </div>
          </div>

          <div>
            <Label>
              Date <span className='text-red-500'>*</span>
            </Label>
            <Input
              type='date'
              className='w-fit'
              placeholder={new Date().toISOString()}
              onChange={(e) => {
                const date = new Date(e.target.value)
                if (date > new Date()) {
                  setErrorMessage('Date must be in the past')
                  uncompleteStep(1)
                } else {
                  setErrorMessage('')
                  completeStep(1)
                }
              }}
            />
          </div>
        </div>

        <div>
          <div className='flex items-center gap-4 pb-2'>
            <div className='w-8 h-8 border rounded-full'>
              {completedSteps[2] ? (
                <CheckIcon className='w-8 h-8 bg-green-400/70 rounded-full p-1.5' />
              ) : (
                <XMarkIcon className='w-8 h-8 bg-red-400/70 rounded-full p-1.5' />
              )}
            </div>
            <div>
              <h2 className='text-lg font-bold leading-5'>
                Step 3: Is it a digital expense? <br />
              </h2>
              <p className='text-sm text-muted-foreground'>
                (Select if the expense is digital or not)
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Checkbox
              className='w-6! h-6'
              onCheckedChange={(checked) => {
                if (isDigitalReceiptRequired) {
                  if (checked) {
                    completeStep(2)
                  } else {
                    uncompleteStep(2)
                  }
                }
              }}
            />
            <Label>This is a digital expense</Label>
          </div>
        </div>

        <div>
          <div className='flex items-center gap-4 pb-2'>
            <div className='w-8 h-8 border rounded-full'>
              {completedSteps[3] && !isDigitalReceiptRequired ? (
                <CheckIcon className='w-8 h-8 bg-green-400/70 rounded-full p-1.5' />
              ) : (
                <XMarkIcon className='w-8 h-8 bg-red-400/70 rounded-full p-1.5' />
              )}
            </div>
            <div>
              <h2 className='text-lg font-bold leading-5'>
                Step 4: Divide the amount by category(ies). <br />
              </h2>
              <p className='text-sm text-muted-foreground'>
                (Select the categories and enter the amount for each one)
              </p>
            </div>
          </div>

          <ul className='space-y-2 mt-4'>
            {categories.map((category, index) => (
              <li key={category.id} className='grid grid-cols-12 gap-4'>
                <div className='w-full flex flex-col gap-2 col-span-3'>
                  {index === 0 && (
                    <Label>
                      Author <span className='text-red-500'>*</span>
                    </Label>
                  )}
                  <Popover
                    open={dropdownOpen === index}
                    onOpenChange={() => {
                      setDropdownOpen((prev) => (prev === index ? -1 : index))
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                        role='combobox'
                        className='w-full items-center justify-between'
                      >
                        <div className='flex items-center gap-2'>
                          <div className='bg-white p-1 rounded-lg'>
                            <Image
                              src={
                                allCommittees.find(
                                  (committee) =>
                                    committee.value === category.author
                                )?.icon || Logo.src
                              }
                              alt='Committee'
                              unoptimized
                              width={24}
                              height={24}
                            />
                          </div>
                          {allCommittees.find(
                            (committee) => committee.value === category.author
                          )?.label || 'Select a committee'}
                        </div>
                        <ChevronDownIcon className='w-5 h-5' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-96! p-0'>
                      <Command>
                        <CommandInput placeholder='Search' />
                        <CommandList>
                          <CommandEmpty>'None found</CommandEmpty>
                          <CommandGroup>
                            {allCommittees.map((committee) => (
                              <CommandItem
                                key={committee.value}
                                value={committee.value}
                                onSelect={(currentValue) => {
                                  const newCategories = [...categories]
                                  newCategories[index].author = currentValue
                                  setDropdownOpen(-1)
                                }}
                                className='flex items-center justify-between'
                              >
                                <div className='flex items-center gap-2'>
                                  <div className='bg-white p-1 rounded-lg'>
                                    <Image
                                      src={committee.icon}
                                      alt={committee.label}
                                      unoptimized
                                      width={24}
                                      height={24}
                                    />
                                  </div>
                                  {committee.label}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className='w-full flex flex-col gap-2 col-span-3'>
                  {index === 0 && (
                    <Label>
                      Category <span className='text-red-500'>*</span>
                    </Label>
                  )}
                  <Input
                    type='text'
                    placeholder='Category'
                    value={category.category}
                    onChange={(e) => {
                      const newCategories = [...categories]
                      newCategories[index].category = e.target.value
                      setCategories(newCategories)
                    }}
                  />
                </div>

                <div className='w-full flex flex-col gap-2 col-span-3'>
                  {index === 0 && (
                    <Label>
                      Type <span className='text-red-500'>*</span>
                    </Label>
                  )}

                  <Input
                    type='text'
                    placeholder='Type'
                    value={category.type}
                    onChange={(e) => {
                      const newCategories = [...categories]
                      newCategories[index].type = e.target.value
                      setCategories(newCategories)
                    }}
                  />
                </div>

                <div className='w-full flex flex-col gap-2 col-span-2'>
                  {index === 0 && (
                    <Label>
                      Amount <span className='text-red-500'>*</span>
                    </Label>
                  )}
                  <Input
                    type='number'
                    placeholder='Amount'
                    value={category.amount}
                    onChange={(e) => {
                      const newCategories = [...categories]
                      newCategories[index].amount = Number.parseFloat(
                        e.target.value
                      )
                      setCategories(newCategories)
                    }}
                  />
                </div>

                <Button
                  className='col-span-1 mt-auto'
                  variant={'destructive'}
                  size={'icon'}
                  disabled={categories.length === 1 && index === 0}
                  onClick={() => {
                    const newCategories = [...categories]
                    newCategories.splice(index, 1)
                    setCategories(newCategories)
                  }}
                >
                  <XMarkIcon className='w-4 h-4' />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            className='mt-4'
            variant={'outline'}
            size={'sm'}
            onClick={addCategory}
          >
            Add Category
          </Button>
        </div>
      </div>
    </>
  )
}
