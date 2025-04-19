'use client'

import { FormStep, FormSteps } from '@/app/[language]/upload/components/step'
import Categorize from '@/components/form/categorize'
import UploadFiles from '@/components/form/uploadFiles'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type Committee from '@/models/Committee'
import type { ExpenseDomain } from '@/models/ExpenseDomain'
import type { Category } from '@/models/Form'
import type { LanguageCode } from '@/models/Language'
import { useExpense, useFiles, useGeneralForm } from '@/providers/FormProvider'
import { subDays } from 'date-fns'
import { useCallback, useState } from 'react'

interface Props {
  language: LanguageCode
  committees: Committee[]
  expenseDomains: ExpenseDomain[]
  onBack: () => void
  onFinalize: () => void
}

export default function Expense({
  language,
  committees,
  expenseDomains,
  onBack,
  onFinalize,
}: Props) {
  const { setError } = useGeneralForm()
  const { expenseData, setExpenseData } = useExpense()
  const { files, removeAllFiles } = useFiles()
  const [completedSteps, setCompletedSteps] = useState([
    files.length > 0,
    expenseData.description.length > 0,
    expenseData.date !== undefined,
    expenseData.files.some((file) => file.name.toLowerCase().endsWith('.pdf'))
      ? expenseData.isDigital
      : true,
    expenseData.categories.length > 0,
  ])
  const [categories, setCategories] = useState<Category[]>([])

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
      <FormSteps
        title='Upload your expense'
        description='Please upload your expense receipt and fill in the required details.'
        backButtonLabel='Back to upload'
        onBackClick={() => {
          removeAllFiles()
          setExpenseData({
            ...expenseData,
            files: [],
            date: new Date(),
            isDigital: false,
            categories: [],
          })
          onBack()
        }}
        showBackButton
      >
        <FormStep
          title='Upload your receipt image'
          description='Upload your receipt image in PDF, PNG, JPG, JPEG, or AVIF format.'
          stepNumber={1}
          isCompleted={completedSteps[0]}
          isActive
        >
          <UploadFiles
            fileUploadStep={0}
            completeStep={completeStep}
            uncompleteStep={uncompleteStep}
            setIsDigitalReceiptRequired={setIsDigitalReceiptRequired}
          />
        </FormStep>

        <FormStep
          title='Enter a description for the expense'
          description='Enter a description for the expense.'
          stepNumber={2}
          isCompleted={completedSteps[1]}
          isActive
        >
          <Textarea
            className='resize-none'
            placeholder='Enter a description for the expense'
            defaultValue={expenseData.description}
            onChange={(e) => {
              setExpenseData({
                ...expenseData,
                description: e.target.value,
              })
              if (e.target.value.length > 0) {
                completeStep(1)
              } else {
                uncompleteStep(1)
              }
            }}
          />
        </FormStep>

        <FormStep
          title='Enter the date of the expense'
          description='Enter the date of the expense. The date must be in the past.'
          stepNumber={3}
          isCompleted={completedSteps[2]}
          isActive
        >
          <Label>
            Date <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='date'
            className=''
            defaultValue={
              subDays(expenseData.date, 1).toISOString().split('T')[0]
            }
            onChange={(e) => {
              const date = new Date(e.target.value)
              if (date > new Date()) {
                setError('Date must be in the past')
                uncompleteStep(2)
              } else {
                setExpenseData({
                  ...expenseData,
                  date: date,
                })
                setError('')
                completeStep(2)
              }
            }}
          />
        </FormStep>

        <FormStep
          title='Is it a digital expense?'
          description='Select if the expense is digital or not.'
          stepNumber={4}
          isCompleted={completedSteps[3]}
          isActive={isDigitalReceiptRequired}
        >
          <div className='flex items-center gap-2'>
            <Checkbox
              id='digital'
              className='w-6! h-6'
              checked={expenseData.isDigital}
              onCheckedChange={(checked) => {
                if (checked === 'indeterminate') return
                setExpenseData({
                  ...expenseData,
                  isDigital: checked,
                })
                if (isDigitalReceiptRequired) {
                  if (checked) {
                    completeStep(3)
                  } else {
                    uncompleteStep(3)
                  }
                }
              }}
            />
            <Label htmlFor='digital'>This is a digital expense</Label>
          </div>
        </FormStep>

        <FormStep
          title='Categorize the expense'
          description='Select the categories and enter the amount for each one.'
          stepNumber={5}
          isCompleted={completedSteps[4]}
          isActive
        >
          <Categorize
            defaultValue={expenseData.categories}
            expenseDomains={expenseDomains}
            setFormCategories={(categories) => {
              setCategories(categories)
            }}
            categoryStep={4}
            completeStep={completeStep}
            uncompleteStep={uncompleteStep}
            committees={committees}
          />
        </FormStep>

        <Button
          className='w-full h-16 mt-8'
          disabled={completedSteps.some(
            (step, index) =>
              !step &&
              ((index !== 4 && !isDigitalReceiptRequired) || index !== 5)
          )}
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
      </FormSteps>
    </>
  )
}
