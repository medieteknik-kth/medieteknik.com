'use client'

import { FormStep, FormSteps } from '@/app/[language]/upload/components/step'
import Categorize from '@/components/form/categorize'
import UploadFiles from '@/components/form/uploadFiles'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type Committee from '@/models/Committee'
import type { ExpenseDomain } from '@/models/ExpenseDomain'
import type { Category } from '@/models/Form'
import type { PaidStatus } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import { useFiles, useInvoice } from '@/providers/FormProvider'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { addDays, startOfDay } from 'date-fns'
import { useCallback, useState } from 'react'

interface Props {
  language: LanguageCode
  committees: Committee[]
  expenseDomains: ExpenseDomain[]
  toExpense: () => void
  onBack: () => void
  onFinalize: () => void
}

export default function Invoice({
  language,
  committees,
  expenseDomains,
  toExpense,
  onBack,
  onFinalize,
}: Props) {
  const { invoiceData, setInvoiceData } = useInvoice()
  const { files, removeAllFiles } = useFiles()
  const [completedSteps, setCompletedSteps] = useState([
    invoiceData.paidStatus !== undefined,
    invoiceData.files.length > 0,
    invoiceData.description !== '',
    true,
    invoiceData.invoiceDate <= new Date() &&
      invoiceData.invoiceDueDate >= startOfDay(addDays(new Date(), 2)) &&
      invoiceData.invoiceDueDate > invoiceData.invoiceDate,
    invoiceData.categories.length > 0,
  ])
  const [categories, setCategories] = useState<Category[]>([])
  const [paidStatus, setPaidStatus] = useState(invoiceData.paidStatus || '')
  const [description, setDescription] = useState('')

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

  const validateDates = useCallback(
    (inputInvoiceDate?: Date, inputDueDate?: Date) => {
      if (!inputInvoiceDate && !inputDueDate) {
        return
      }
      const invoiceDate = inputInvoiceDate || invoiceData.invoiceDate
      const dueDate = inputDueDate || invoiceData.invoiceDueDate

      const minimumDate = startOfDay(addDays(new Date(), 2))
      const today = new Date()
      const isValid =
        invoiceDate < today && dueDate > invoiceDate && dueDate > minimumDate

      if (isValid) {
        completeStep(4)
      } else {
        uncompleteStep(4)
      }
    },
    [
      completeStep,
      uncompleteStep,
      invoiceData.invoiceDate,
      invoiceData.invoiceDueDate,
    ]
  )

  return (
    <>
      <FormSteps
        title='Upload Invoice'
        description='Please fill in the following information to upload your invoice.'
        backButtonLabel='Back to upload'
        onBackClick={() => {
          removeAllFiles()
          setInvoiceData({
            ...invoiceData,
            files: [],
            description: '',
            isOriginalInvoice: false,
            isInvoiceBooked: false,
            invoiceDate: new Date(),
            invoiceDueDate: new Date(),
            categories: [],
          })
          onBack()
        }}
        showBackButton
      >
        <FormStep
          title='Payment status'
          description='Please select the payment status of the invoice.'
          stepNumber={1}
          isCompleted={completedSteps[0]}
          isActive
        >
          <RadioGroup
            defaultValue={paidStatus}
            onValueChange={(value) => {
              setPaidStatus(value)
              if (value === 'no_chapter' || value === 'yes_chapter') {
                setInvoiceData({
                  ...invoiceData,
                  paidStatus: value as PaidStatus,
                })
              }
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
              <Label htmlFor='yes_chapter'>Yes, the chapter has paid.</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='yes_personal' id='yes_personal' />
              <Label htmlFor='yes_personal'>Yes, I have paid</Label>
            </div>
          </RadioGroup>
        </FormStep>

        {paidStatus === '' ? (
          <></>
        ) : paidStatus === 'no_personal' || paidStatus === 'yes_personal' ? (
          <div className='flex flex-col gap-4'>
            <Separator className='my-4' />
            <div className='flex items-center gap-4 pb-2'>
              <ExclamationTriangleIcon className='w-8 h-8 text-orange-500' />
              {paidStatus === 'no_personal' ? (
                <p>
                  Then it counts as an expense. <br />
                  <span className='text-sm text-muted-foreground'>
                    Note: It will need to be paid before registering it as an
                    expense.
                  </span>
                </p>
              ) : (
                <p>Then it counts as an expense. Please register it as such.</p>
              )}
            </div>

            <Button
              onClick={() => {
                setCompletedSteps([false, false, false, true, false, false])
                setPaidStatus('')
                removeAllFiles()
                toExpense()
              }}
            >
              Register as expense
            </Button>
          </div>
        ) : (
          <>
            <FormStep
              title='Upload the invoice'
              description='Please upload the invoice image.'
              stepNumber={2}
              isCompleted={completedSteps[1]}
              isActive
            >
              <UploadFiles
                fileUploadStep={1}
                completeStep={completeStep}
                uncompleteStep={uncompleteStep}
              />
            </FormStep>

            <FormStep
              title='Describe the contents'
              description='Please describe the contents of the invoice.'
              stepNumber={3}
              isCompleted={completedSteps[2]}
              isActive
            >
              <div>
                <Label htmlFor='description' className='text-sm font-medium'>
                  Description
                  <span className='text-red-500'>*</span>
                </Label>
                <Textarea
                  placeholder='Invoice description'
                  defaultValue={invoiceData.description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (e.target.value.length > 0) {
                      completeStep(2)
                    } else {
                      uncompleteStep(2)
                    }
                  }}
                />
              </div>
            </FormStep>

            <FormStep
              title='Invoice details'
              description='Please select the invoice details.'
              stepNumber={4}
              isCompleted={completedSteps[3]}
              isActive
            >
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Checkbox
                    className='w-6! h-6'
                    id='original'
                    defaultChecked={invoiceData.isOriginalInvoice}
                    onCheckedChange={(checked) => {
                      if (checked === 'indeterminate') return
                      setInvoiceData({
                        ...invoiceData,
                        isOriginalInvoice: checked,
                      })
                    }}
                  />
                  <Label htmlFor='original'>
                    The file I have uploaded is the original invoice.
                  </Label>
                </div>
                {paidStatus === 'yes_chapter' && (
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      className='w-6! h-6'
                      id='booked'
                      defaultChecked={invoiceData.isInvoiceBooked}
                      onCheckedChange={(checked) => {
                        if (checked === 'indeterminate') return
                        setInvoiceData({
                          ...invoiceData,
                          isInvoiceBooked: checked,
                        })
                      }}
                    />
                    <Label htmlFor='booked'>
                      The invoice is booked in the chapter's accounting system.
                    </Label>
                  </div>
                )}
              </div>
            </FormStep>

            <FormStep
              title='Invoice dates'
              description='Please select the invoice dates.'
              stepNumber={5}
              isCompleted={completedSteps[4]}
              isActive
            >
              <div className='flex items-center gap-2 flex-wrap'>
                <div>
                  <Label>
                    Invoice date
                    <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    type='date'
                    className='w-42'
                    defaultValue={
                      invoiceData.invoiceDate.toISOString().split('T')[0]
                    }
                    onChange={(e) => {
                      const invoiceDate = new Date(e.target.value)
                      setInvoiceData({
                        ...invoiceData,
                        invoiceDate,
                      })
                      validateDates(invoiceDate)
                    }}
                  />
                </div>
                <div>
                  <Label>
                    Invoice due date
                    <span className='text-red-500'>*</span>{' '}
                    <span>
                      <span className='text-sm text-muted-foreground'>
                        (Minimum: {addDays(new Date(), 2).toLocaleDateString()})
                      </span>
                    </span>
                  </Label>
                  <Input
                    type='date'
                    className='w-42'
                    defaultValue={
                      invoiceData.invoiceDueDate.toISOString().split('T')[0]
                    }
                    onChange={(e) => {
                      const invoiceDueDate = new Date(e.target.value)
                      setInvoiceData({
                        ...invoiceData,
                        invoiceDueDate,
                      })

                      validateDates(undefined, invoiceDueDate)
                    }}
                  />
                </div>
              </div>
            </FormStep>

            <FormStep
              title='Categorize the invoice'
              description='Please categorize the invoice.'
              stepNumber={6}
              isCompleted={completedSteps[5]}
              isActive
            >
              <Categorize
                defaultValue={invoiceData.categories}
                expenseDomains={expenseDomains}
                setFormCategories={(categories) => {
                  setCategories(categories)
                }}
                categoryStep={5}
                completeStep={completeStep}
                uncompleteStep={uncompleteStep}
                committees={committees}
              />
            </FormStep>

            <Button
              className='w-full h-16 mt-4'
              disabled={completedSteps.includes(false)}
              onClick={() => {
                setInvoiceData({
                  ...invoiceData,
                  description:
                    invoiceData.description === ''
                      ? description
                      : invoiceData.description,
                  files: files,
                  categories: categories,
                })
                onFinalize()
              }}
            >
              Finalize Invoice
            </Button>
          </>
        )}
      </FormSteps>
    </>
  )
}
