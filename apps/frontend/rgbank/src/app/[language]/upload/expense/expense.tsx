'use client'
import Categorize from '@/components/form/categorize'
import UploadFiles from '@/components/form/uploadFiles'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type Committee from '@/models/Committee'
import type { Category } from '@/models/Form'
import { useExpense, useFiles, useGeneralForm } from '@/providers/FormProvider'
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

export default function Expense({ committees, onBack, onFinalize }: Props) {
  const { setError } = useGeneralForm()
  const { expenseData, setExpenseData } = useExpense()

  const [completedSteps, setCompletedSteps] = useState([
    expenseData.files.length > 0,
    expenseData.date !== undefined,
    expenseData.files.length > 0 ? expenseData.isDigital : true,
    expenseData.categories.length > 0,
  ])
  const [categories, setCategories] = useState<Category[]>([])
  const { files } = useFiles()

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

  return (
    <>
      <div className='grid grid-cols-3 items-center'>
        <Button
          className='w-fit flex gap-4'
          variant={'outline'}
          onClick={() => {
            setCompletedSteps([false, false, true, false])
            setError('')
            setIsDigitalReceiptRequired(false)

            onBack()
          }}
        >
          <ArrowLeftIcon className='w-4 h-4' />
          Back
        </Button>
        <div>
          <p className='text-center text-sm text-muted-foreground'>
            Fill in the details of your expense.
          </p>
          <h1 className='text-3xl font-bold text-center'>Expense</h1>
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
                Step 1: Upload your receipt image. <br />
              </h2>
              <p className='text-sm text-muted-foreground'>
                (PDF, PNG, JPG, JPEG, AVIF)
              </p>
            </div>
          </div>
          <UploadFiles
            fileUploadStep={0}
            completeStep={completeStep}
            uncompleteStep={uncompleteStep}
            setIsDigitalReceiptRequired={setIsDigitalReceiptRequired}
          />
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

          <Label>
            Date <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='date'
            className=''
            defaultValue={expenseData.date?.toISOString().split('T')[0]}
            placeholder={new Date().toISOString()}
            onChange={(e) => {
              const date = new Date(e.target.value)
              if (date > new Date()) {
                setError('Date must be in the past')
                uncompleteStep(1)
              } else {
                setExpenseData({
                  ...expenseData,
                  date: date,
                })
                setError('')
                completeStep(1)
              }
            }}
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
                Step 3: Is it a digital expense? <br />
              </h2>
              <p className='text-sm text-muted-foreground'>
                (Select if the expense is digital or not)
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Checkbox
              id='digital'
              className='w-6! h-6'
              onCheckedChange={(checked) => {
                if (checked === 'indeterminate') return
                setExpenseData({
                  ...expenseData,
                  isDigital: checked,
                })
                if (isDigitalReceiptRequired) {
                  if (checked) {
                    completeStep(2)
                  } else {
                    uncompleteStep(2)
                  }
                }
              }}
            />
            <Label htmlFor='digital'>This is a digital expense</Label>
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

          <Categorize
            defaultValue={expenseData.categories}
            setFormCategories={(categories) => {
              setCategories(categories)
            }}
            categoryStep={3}
            completeStep={completeStep}
            uncompleteStep={uncompleteStep}
            committees={committees}
          />
        </div>

        <Button
          disabled={completedSteps.some((step, index) => !step && index !== 3)}
          onClick={() => {
            setExpenseData({
              ...expenseData,
              files: files,
              categories: categories,
            })

            onFinalize()
          }}
        >
          Finalize Expense
        </Button>
      </div>
    </>
  )
}
