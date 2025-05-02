'use client'

import { FormStep, FormSteps } from '@/app/[language]/upload/components/step'
import { useTranslation } from '@/app/i18n/client'
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
    expenseData.title.length > 0,
    files.length > 0,
    expenseData.description.length > 0,
    expenseData.date !== undefined,
    true,
    expenseData.categories.length > 0,
  ])
  const [categories, setCategories] = useState<Category[]>([])
  const { t } = useTranslation(language, 'upload/expense')

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
        language={language}
        title={t('title')}
        description={t('description')}
        backButtonLabel={t('back')}
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
          title={t('step_1.title')}
          description={t('step_1.description')}
          stepNumber={1}
          isCompleted={completedSteps[0]}
          isActive
          required
        >
          <Input
            placeholder={t('step_1.placeholder')}
            defaultValue={expenseData.title}
            maxLength={150}
            onChange={(e) => {
              setExpenseData({
                ...expenseData,
                title: e.target.value,
              })
              if (e.target.value.length > 0) {
                completeStep(0)
              } else {
                uncompleteStep(0)
              }
            }}
          />
        </FormStep>

        <FormStep
          title={t('step_2.title')}
          description={t('step_2.description')}
          stepNumber={2}
          isCompleted={completedSteps[1]}
          isActive
          required
        >
          <UploadFiles
            language={language}
            fileUploadStep={1}
            completeStep={completeStep}
            uncompleteStep={uncompleteStep}
            setIsDigitalReceiptRequired={setIsDigitalReceiptRequired}
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
          <Textarea
            className='resize-none'
            placeholder={t('step_3.placeholder')}
            defaultValue={expenseData.description}
            onChange={(e) => {
              setExpenseData({
                ...expenseData,
                description: e.target.value,
              })
              if (e.target.value.length > 0) {
                completeStep(2)
              } else {
                uncompleteStep(2)
              }
            }}
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
          <Label>{t('step_4.label')}</Label>
          <Input
            type='date'
            defaultValue={
              subDays(expenseData.date, 1).toISOString().split('T')[0]
            }
            onChange={(e) => {
              const date = new Date(e.target.value)
              if (date > new Date()) {
                setError('Date must be in the past')
                uncompleteStep(3)
              } else {
                setExpenseData({
                  ...expenseData,
                  date: date,
                })
                setError('')
                completeStep(3)
              }
            }}
          />
        </FormStep>

        <FormStep
          title={t('step_5.title')}
          description={t('step_5.description')}
          stepNumber={5}
          isCompleted={completedSteps[4]}
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
                    completeStep(4)
                  } else {
                    uncompleteStep(4)
                  }
                }
              }}
            />
            <Label htmlFor='digital'>{t('step_5.label')}</Label>
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
          <Categorize
            language={language}
            defaultValue={expenseData.categories}
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
          className='w-full h-16 mt-8'
          disabled={completedSteps.some(
            (step, index) =>
              !step &&
              ((index !== 5 && !isDigitalReceiptRequired) || index !== 6)
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
          {t('finalize')}
        </Button>
      </FormSteps>
    </>
  )
}
