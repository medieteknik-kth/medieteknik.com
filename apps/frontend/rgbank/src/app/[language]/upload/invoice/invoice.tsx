'use client'

import { FormStep, FormSteps } from '@/app/[language]/upload/components/step'
import { useTranslation } from '@/app/i18n/client'
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
    invoiceData.title.length > 0,
    files.length > 0,
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
  const { t } = useTranslation(language, 'upload/invoice')

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

      const today = new Date()
      const isValid = invoiceDate < today && dueDate > invoiceDate

      if (isValid) {
        completeStep(5)
      } else {
        uncompleteStep(5)
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
        language={language}
        title={t('title')}
        description={t('description')}
        backButtonLabel={t('back')}
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
          title={t('step_1.title')}
          description={t('step_1.description')}
          stepNumber={1}
          isCompleted={completedSteps[0]}
          isActive
          required
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
              <Label htmlFor='no_chapter'>{t('step_1.option_1')}</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='no_personal' id='no_personal' />
              <Label htmlFor='no_personal'>{t('step_1.option_2')}</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='yes_chapter' id='yes_chapter' />
              <Label htmlFor='yes_chapter'>{t('step_1.option_3')}</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='yes_personal' id='yes_personal' />
              <Label htmlFor='yes_personal'>{t('step_1.option_4')}</Label>
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
                  {t('step_1.failed.option_2.title')} <br />
                  <span className='text-sm text-muted-foreground'>
                    {t('step_1.failed.option_2.description')}
                  </span>
                </p>
              ) : (
                <p>{t('step_1.failed.option_4.title')}</p>
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
              {t('step_1.failed.next')}
            </Button>
          </div>
        ) : (
          <>
            <FormStep
              title={t('step_2.title')}
              description={t('step_2.description')}
              stepNumber={2}
              isCompleted={completedSteps[1]}
              isActive
              required
            >
              <Input
                placeholder={t('step_2.placeholder')}
                defaultValue={invoiceData.title}
                maxLength={150}
                onChange={(e) => {
                  setInvoiceData({
                    ...invoiceData,
                    title: e.target.value,
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
              title={t('step_3.title')}
              description={t('step_3.description')}
              stepNumber={3}
              isCompleted={completedSteps[2]}
              isActive
              required
            >
              <UploadFiles
                language={language}
                fileUploadStep={2}
                completeStep={completeStep}
                uncompleteStep={uncompleteStep}
              />
            </FormStep>

            <FormStep
              title={t('step_4.title')}
              description={t('step_4.description')}
              stepNumber={4}
              isCompleted={completedSteps[3]}
              isActive
              required
            >
              <div>
                <Label htmlFor='description' className='text-sm font-medium'>
                  {t('step_4.label')}
                </Label>
                <Textarea
                  placeholder={t('step_4.placeholder')}
                  defaultValue={invoiceData.description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (e.target.value.length > 0) {
                      completeStep(3)
                    } else {
                      uncompleteStep(3)
                    }
                  }}
                />
              </div>
            </FormStep>

            <FormStep
              title={t('step_5.title')}
              description={t('step_5.description')}
              stepNumber={5}
              isCompleted={completedSteps[4]}
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
                  <Label htmlFor='original'>{t('step_5.option_1')}</Label>
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
                    <Label htmlFor='booked'>{t('step_5.option_2')}</Label>
                  </div>
                )}
              </div>
            </FormStep>

            <FormStep
              title={t('step_6.title')}
              description={t('step_6.description')}
              stepNumber={6}
              isCompleted={completedSteps[5]}
              isActive
              required
            >
              <div className='flex items-center gap-2 flex-wrap'>
                <div>
                  <Label>
                    {t('step_6.label_1')}
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
                    {t('step_6.label_2')}
                    <span className='text-red-500'>*</span>{' '}
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
              title={t('step_7.title')}
              description={t('step_7.description')}
              stepNumber={7}
              isCompleted={completedSteps[6]}
              isActive
            >
              <Categorize
                language={language}
                defaultValue={invoiceData.categories}
                expenseDomains={expenseDomains}
                setFormCategories={(categories) => {
                  setCategories(categories)
                }}
                categoryStep={6}
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
              {t('finalize')}
            </Button>
          </>
        )}
      </FormSteps>
    </>
  )
}
