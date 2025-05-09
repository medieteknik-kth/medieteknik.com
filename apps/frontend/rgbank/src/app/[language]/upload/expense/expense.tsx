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
import type { ExpenseDomain } from '@/models/ExpenseDomain'
import type { Category } from '@/models/Form'
import { useExpense, useFiles, useGeneralForm } from '@/providers/FormProvider'
import type { Committee } from '@medieteknik/models'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
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
  const { error, setError } = useGeneralForm()
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
          labelledby='step_1_title'
          describedby='step_1_description'
          isActive
          required
        >
          <Input
            id='title'
            name='title'
            role='textbox'
            title={t('step_1.title')}
            aria-labelledby='step_1_title'
            aria-describedby='step_1_description'
            placeholder={t('step_1.placeholder')}
            defaultValue={expenseData.title}
            maxLength={151}
            onChange={(e) => {
              if (e.target.value.length > 150) {
                setError(
                  t('error.title.max_length', {
                    maxLength: 150,
                  })
                )
                e.target.value = e.target.value.slice(0, 150)
                setTimeout(() => {
                  setError('')
                }, 5000)
              }
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
          labelledby='step_2_title'
          describedby='step_2_description'
          isActive
          required
        >
          <UploadFiles
            language={language}
            fileUploadStep={1}
            ariaDescribedby='step_2_description'
            ariaLabelledby='step_2_title'
            completeStep={(step) => {
              setError('')
              completeStep(step)
            }}
            uncompleteStep={uncompleteStep}
            setIsDigitalReceiptRequired={setIsDigitalReceiptRequired}
          />
        </FormStep>

        <FormStep
          title={t('step_3.title')}
          description={t('step_3.description')}
          stepNumber={3}
          isCompleted={completedSteps[2]}
          labelledby='step_3_title'
          describedby='step_3_description'
          isActive
          required
        >
          <Textarea
            id='description'
            name='description'
            role='textbox'
            title={t('step_3.title')}
            aria-labelledby='step_3_title'
            aria-describedby='step_3_description'
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
          <Label htmlFor='date'>{t('step_4.label')}</Label>
          <Input
            type='date'
            id='date'
            role='textbox'
            name='date'
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
              name='digital'
              role='checkbox'
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
          id='submit'
          type='submit'
          title={t('finalize')}
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

      {error && (
        <div className='fixed bottom-4 left-0 right-0 z-50 flex justify-center items-center p-4'>
          <div className='bg-red-500 dark:bg-neutral-900 p-4 rounded-lg shadow-md'>
            <h2 className='text-white font-bold text-xl'>{error}</h2>
          </div>
        </div>
      )}
    </>
  )
}
