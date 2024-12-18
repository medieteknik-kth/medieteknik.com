import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LanguageCode } from '@/models/Language'
import { TFunction } from 'next-i18next'

import type { JSX } from 'react'

interface Props {
  index: number
  language: LanguageCode
  t: TFunction
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
}: Props): JSX.Element {
  return (
    <>
      <FormField
        name={`translations.${index}.language_code`}
        render={({ field }) => (
          <FormItem>
            <Input id='language' type='hidden' {...field} />
          </FormItem>
        )}
      />
      <FormField
        name={`translations.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('event.form.title')}{' '}
              <span className='uppercase text-xs tracking-wide'>
                [{language}]
              </span>
            </FormLabel>
            <FormControl>
              <Input id='title' type='text' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name={`translations.${index}.description`}
        render={({ field }) => (
          <FormItem className='mt-2'>
            <FormLabel>
              {t('event.form.description')}{' '}
              <span className='uppercase text-xs tracking-wide select-none'>
                [{language}]
              </span>
            </FormLabel>
            <FormControl>
              <Textarea id='description' placeholder='Optional' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
