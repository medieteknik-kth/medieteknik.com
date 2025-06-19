import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { LanguageCode } from '@/models/Language'
import type { eventUploadSchema } from '@/schemas/items/event'
import { LANGUAGES } from '@/utility/Constants'
import type { TFunction } from 'next-i18next'

import type { JSX } from 'react'
import type { z } from 'zod/v4-mini'

interface Props {
  index: number
  language: LanguageCode
  t: TFunction
  form: z.infer<typeof eventUploadSchema>
  setForm: React.Dispatch<
    React.SetStateAction<z.infer<typeof eventUploadSchema>>
  >
  formErrors: {
    event_start_date: string
    event_end_date: string
    location: string
    background_color: string
    translations: Record<
      LanguageCode,
      {
        title: string
        description: string
      }
    >
  }
}

/**
 * @name TranslatedInputs
 * @description Inputs for translated fields
 *
 * @param {Props} props - The props for the component
 * @param {number} props.index - The index of the input
 * @param {string} props.language - The language of the input
 * @param {TFunction} props.t - The translation function
 * @returns {JSX.Element} The translated inputs
 */
export default function TranslatedInputs({
  index,
  language,
  t,
  form,
  setForm,
  formErrors,
}: Props): JSX.Element {
  return (
    <>
      <div>
        <Input id='language' type='hidden' value={language} />
      </div>

      <div>
        <Label className='text-sm font-semibold'>
          {t('event.form.title')}{' '}
          <span className='uppercase text-xs tracking-wide select-none'>
            [{LANGUAGES[language].name}]
          </span>
          <span className='text-red-500 px-0.5 select-none'>*</span>
        </Label>
        <Input
          id={`translations.${index}.title`}
          type='text'
          value={form.translations[index].title}
          onChange={(e) => {
            const newTranslations = [...form.translations]
            newTranslations[index].title = e.target.value
            setForm({ ...form, translations: newTranslations })
          }}
        />
        {formErrors.translations[language]?.title && (
          <p className='text-red-500 text-xs mt-1'>
            {formErrors.translations[language].title}
          </p>
        )}
      </div>

      <div>
        <Label className='text-sm font-semibold mt-2'>
          {t('event.form.description')}{' '}
          <span className='uppercase text-xs tracking-wide select-none'>
            [{LANGUAGES[language].name}]
          </span>
          <span className='text-red-500 px-0.5 select-none'>*</span>
        </Label>
        <Textarea
          id={`translations.${index}.description`}
          placeholder='Optional'
          value={form.translations[index].description}
          onChange={(e) => {
            const newTranslations = [...form.translations]
            newTranslations[index].description = e.target.value
            setForm({ ...form, translations: newTranslations })
          }}
        />
        {formErrors.translations[language]?.description && (
          <p className='text-red-500 text-xs mt-1'>
            {formErrors.translations[language].description}
          </p>
        )}
      </div>
    </>
  )
}
