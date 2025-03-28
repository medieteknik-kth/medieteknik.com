'use client'

import Categorize from '@/components/form/categorize'
import UploadFiles from '@/components/form/uploadFiles'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type Committee from '@/models/Committee'
import type { Category } from '@/models/Form'
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useCallback, useState } from 'react'

interface Props {
  committees: Committee[]
  onBack: () => void
  onFinalize: () => void
}

export default function Invoice({ committees, onBack, onFinalize }: Props) {
  const [completedSteps, setCompletedSteps] = useState([
    false,
    false,
    false,
    true,
    false,
    false,
  ])
  const [categories, setCategories] = useState<Category[]>([])
  const [paidStatus, setPaidStatus] = useState('')

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

  return (
    <>
      <div className='grid grid-cols-3 items-center'>
        <Button
          className='w-fit flex gap-4'
          variant={'outline'}
          onClick={() => {
            setCompletedSteps([false, false, false, true, false, false])
            setPaidStatus('')
            onBack()
          }}
        >
          <ArrowLeftIcon className='w-4 h-4' />
          Back
        </Button>
        <div>
          <p className='text-center text-sm text-muted-foreground'>
            Invoice ID: <strong>1234567890</strong>
          </p>
          <h1 className='text-3xl font-bold text-center'>Invoice</h1>
        </div>
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
                Step 1: Is the Invoice already paid?
                <br />
              </h2>
              <p className='text-sm text-muted-foreground'>
                Choose the relevant option regarding the status of the invoice.
              </p>
            </div>
          </div>

          <RadioGroup
            onValueChange={(value) => {
              setPaidStatus(value)
              completeStep(0)
            }}
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='no_chapter' id='no_chapter' />
              <Label htmlFor='no_chapter'>No, the chapter should pay.</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='no_personal' id='no_personal' />
              <Label htmlFor='no_personal'>No, I am going to pay.</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='yes_chapter' id='yes_chapter' />
              <Label htmlFor='yes_chapter'>Yes, the chapter has paid</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='yes_personal' id='yes_personal' />
              <Label htmlFor='yes_personal'>Yes, I have paid</Label>
            </div>
          </RadioGroup>
        </div>

        {paidStatus === '' ? (
          <></>
        ) : paidStatus === 'no_personal' || paidStatus === 'yes_personal' ? (
          <div>Register it as an expense instead</div>
        ) : (
          <>
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
                    Step 2: Upload the invoice. <br />
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    (PDF, PNG, JPG, JPEG, AVIF)
                  </p>
                </div>
              </div>
              <UploadFiles
                fileUploadStep={1}
                completeStep={completeStep}
                uncompleteStep={uncompleteStep}
              />
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
                    Step 3: Describe the contents <br />
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    Should be a short description of the contents of the
                    invoice.
                  </p>
                </div>
              </div>
              <div>
                <Label htmlFor='description' className='text-sm font-medium'>
                  Description
                  <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  placeholder='Invoice description'
                  onChange={(e) => {
                    if (e.target.value.length > 0) {
                      completeStep(2)
                    } else {
                      uncompleteStep(2)
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <div className='flex items-center gap-4 pb-2'>
                <div className='w-8 h-8 border rounded-full'>
                  {completedSteps[3] ? (
                    <CheckIcon className='w-8 h-8 bg-green-400/70 rounded-full p-1.5' />
                  ) : (
                    <XMarkIcon className='w-8 h-8 bg-red-400/70 rounded-full p-1.5' />
                  )}
                </div>
                <div>
                  <h2 className='text-lg font-bold leading-5'>
                    Step 4: Invoice details
                    <br />
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    Related to the file you uploaded.
                  </p>
                </div>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Checkbox className='w-6! h-6' id='original' />
                  <Label htmlFor='original'>
                    The file I have uploaded is the original invoice.
                  </Label>
                </div>
                {paidStatus === 'yes_chapter' && (
                  <div className='flex items-center gap-2'>
                    <Checkbox className='w-6! h-6' id='booked' />
                    <Label htmlFor='booked'>
                      The invoice is booked in the chapter's accounting system.
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className='flex items-center gap-4 pb-2'>
                <div className='w-8 h-8 border rounded-full'>
                  {completedSteps[4] ? (
                    <CheckIcon className='w-8 h-8 bg-green-400/70 rounded-full p-1.5' />
                  ) : (
                    <XMarkIcon className='w-8 h-8 bg-red-400/70 rounded-full p-1.5' />
                  )}
                </div>
                <div>
                  <h2 className='text-lg font-bold leading-5'>
                    Step 5: Additional information
                    <br />
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    Metadata about the invoice.
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div>
                  <Label>
                    Invoice date
                    <span className='text-red-500'>*</span>
                  </Label>
                  <Input type='date' className='w-42' />
                </div>
                <div>
                  <Label>
                    Invoice due date
                    <span className='text-red-500'>*</span>
                  </Label>
                  <Input type='date' className='w-42' />
                </div>
              </div>
            </div>

            <div>
              <div className='flex items-center gap-4 pb-2'>
                <div className='w-8 h-8 border rounded-full'>
                  {completedSteps[5] ? (
                    <CheckIcon className='w-8 h-8 bg-green-400/70 rounded-full p-1.5' />
                  ) : (
                    <XMarkIcon className='w-8 h-8 bg-red-400/70 rounded-full p-1.5' />
                  )}
                </div>
                <div>
                  <h2 className='text-lg font-bold leading-5'>
                    Step 6: Divide the amount by category(ies)
                    <br />
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    (Select the categories and enter the amount for each one)
                  </p>
                </div>
              </div>

              <Categorize
                setFormCategories={(categories) => {
                  setCategories(categories)
                }}
                categoryStep={5}
                completeStep={completeStep}
                uncompleteStep={uncompleteStep}
                committees={committees}
              />
            </div>

            <Button
              onClick={() => {
                onFinalize()
              }}
            >
              Finalize Invoice
            </Button>
          </>
        )}
      </div>
    </>
  )
}
