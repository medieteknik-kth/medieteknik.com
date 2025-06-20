'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Author } from '@/models/Items'
import type { LanguageCode } from '@/models/Language'
import type Event from '@/models/items/Event'
import { useStudent } from '@/providers/AuthenticationProvider'
import type { eventUploadSchema } from '@/schemas/items/event'
import { LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { EyeDropperIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { type JSX, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import type { z } from 'zod/v4-mini'
import RepeatingForm from './event/repeating'
import TranslatedInputs from './event/translations'

interface Props {
  language: LanguageCode
  selectedDate: Date
  closeMenuCallback: () => void
  author: Author
  addEvent?: (event: Event) => void
}

/**
 * @name EventUpload
 * @description Upload an event
 *
 * @param {Props} props - The props for the component
 * @param {string} props.language - The language of the event
 * @param {Date} props.selectedDate - The date of the event
 * @param {() => void} props.closeMenuCallback - The callback function to close the menu
 * @param {(event: Event) => void} props.addEvent - The callback function to add the event optimistically (optional)
 *
 * @returns {JSX.Element} The EventForm component
 */
export default function EventUpload({
  language,
  selectedDate,
  author,
  closeMenuCallback,
  addEvent,
}: Props): JSX.Element {
  const { student } = useStudent()
  const { t } = useTranslation(language, 'bulletin')
  const [isRepeating, setIsRepeating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [currentColor, setCurrentColor] = useState('#EEC912')
  const presetColors = [
    {
      color: '#FACC15',
      title: 'Yellow (#FACC15)',
    },
    {
      color: '#111111',
      title: 'Smokey Black (#111111)',
    },
    {
      color: '#EC3F83',
      title: 'CompSci Pink (#EC3F83)',
    },
    {
      color: '#45B8DA',
      title: 'THS Blue (#45B8DA)',
    },
    {
      color: '#EF4444',
      title: 'Red (#EF4444)',
    },
  ]
  const [form, setForm] = useState<z.infer<typeof eventUploadSchema>>({
    translations: SUPPORTED_LANGUAGES.map((language) => ({
      language_code: language,
      title: '',
      description: '',
    })),
    event_start_date: new Date(selectedDate.getTime() + 60 * 60 * 1000),
    event_end_date: new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000),
    repeats: false,
    location: '',
    background_color: currentColor,
  })
  const [formErrors, setFormErrors] = useState({
    event_start_date: '',
    event_end_date: '',
    location: '',
    background_color: '',
    translations: SUPPORTED_LANGUAGES.reduce(
      (acc, language) => {
        acc[language] = { title: '', description: '' }
        return acc
      },
      {} as Record<LanguageCode, { title: string; description: string }>
    ),
  })

  const handleColorChange = (color: string) => {
    setForm({
      ...form,
      background_color: color,
    })
    setCurrentColor(color)
  }

  const submit = async (data: z.infer<typeof eventUploadSchema>) => {
    if (!student) {
      setErrorMessage('You need to be logged in!')
      return
    }
    const duration =
      (new Date(data.event_end_date).getTime() -
        new Date(data.event_start_date).getTime()) /
      60000

    if (duration <= 0) {
      setErrorMessage('End date must be after start date')
      return
    }

    if (data.repeats) {
      if (!data.frequency) {
        setErrorMessage('Frequency is required')
        return
      }
    }

    const json_data = {
      start_date: data.event_start_date,
      duration: duration,
      repeats: data.repeats,
      frequency: data.repeats ? data.frequency : null,
      max_occurrences: data.repeats ? data.max_occurrences : null,
      background_color: data.background_color,
      location: data.location,
      author: author,
      translations: data.translations,
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(json_data),
      })

      if (response.ok) {
        const json = (await response.json()) as {
          id: string
        }
        if (addEvent) {
          addEvent({
            start_date: new Date(data.event_start_date).toLocaleString(
              language,
              {
                timeZone: 'Europe/Stockholm',
              }
            ),
            event_id: json.id,
            duration: duration,
            background_color: data.background_color,
            location: data.location,
            created_at: new Date().toLocaleDateString(),
            is_pinned: false,
            is_public: true,
            published_status: 'PUBLISHED',
            author: student,
            translations: data.translations.map((translation) => ({
              ...translation,
              language_code: translation.language_code as LanguageCode,
            })),
          })
        }

        closeMenuCallback()
      } else {
        setErrorMessage('Something went wrong, try again later!')
        console.error(response)
      }
    } catch (error) {
      setErrorMessage('Something went wrong, try again later!')
      console.error(error)
    }
  }

  if (!student) {
    return <DialogContent>You need to be logged in!</DialogContent>
  }

  return (
    <DialogContent className='h-fit'>
      <DialogHeader>
        <DialogTitle>{t('event.form.add')}</DialogTitle>
        <DialogDescription>{t('event.form.add_to_calendar')}</DialogDescription>
      </DialogHeader>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      <Tabs defaultValue={language} className='mb-2 -mt-1'>
        <Label>{t('event.form.language')}</Label>
        <TabsList className='overflow-x-auto h-fit w-full justify-start'>
          {SUPPORTED_LANGUAGES.map((language) => (
            <TabsTrigger
              key={language}
              value={language}
              className='w-fit'
              title={LANGUAGES[language].name}
            >
              <span className='w-6 h-6'>
                {LANGUAGES[language as LanguageCode].flag_icon}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(form)
          }}
        >
          <div className='grid grid-cols-2 gap-2 mt-2 relative mb-2'>
            <div>
              <Label className='text-sm font-semibold'>
                {t('event.form.date')}
                <span className='text-red-500 px-0.5 select-none'>*</span>
              </Label>
              <Input
                id='startdate'
                type='datetime-local'
                value={new Date(form.event_start_date)
                  .toISOString()
                  .slice(0, 16)}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  setForm({
                    ...form,
                    event_start_date: date,
                    event_end_date: new Date(
                      date.getTime() + 60 * 60 * 1000 // Default to 1 hour later
                    ),
                  })
                }}
              />
              {formErrors.event_start_date && (
                <p className='text-red-500 text-sm mt-1'>
                  {formErrors.event_start_date}
                </p>
              )}
            </div>

            <div>
              <Label className='text-sm font-semibold'>
                {t('event.form.end_date')}
                <span className='text-red-500 px-0.5 select-none'>*</span>
              </Label>
              <Input
                id='enddate'
                type='datetime-local'
                value={new Date(form.event_end_date).toISOString().slice(0, 16)}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  setForm({
                    ...form,
                    event_end_date: date,
                  })
                }}
              />
              {formErrors.event_end_date && (
                <p className='text-red-500 text-sm mt-1'>
                  {formErrors.event_end_date}
                </p>
              )}
            </div>
          </div>

          <div>
            <Checkbox
              id='repeats'
              type='button'
              value={isRepeating ? 'on' : 'off'}
              className='hidden'
              onClick={(e) => {
                setIsRepeating(e.currentTarget.value === 'on' && !isRepeating)
                setForm({
                  ...form,
                  repeats: e.currentTarget.value === 'on' && !isRepeating,
                })
              }}
            />

            <Label className='text-sm font-semibold'>
              {t('event.form.repeats')}
            </Label>
          </div>

          {isRepeating && (
            <RepeatingForm
              language={language}
              form={form}
              setValue={(value) => {
                setForm({
                  ...form,
                  frequency: value as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
                })
              }}
            />
          )}

          <div>
            <Label className='text-sm font-semibold'>
              {t('event.form.location')}
              <span className='text-red-500 px-0.5 select-none'>*</span>
            </Label>
            <div className='relative'>
              <Input
                id='location'
                type='text'
                value={form.location}
                onChange={(e) => {
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }}
              />
              <MapPinIcon className='absolute top-0 bottom-0 my-auto right-2 w-5 h-5 text-neutral-500' />
            </div>
            {formErrors.location && (
              <p className='text-red-500 text-sm mt-1'>{formErrors.location}</p>
            )}
          </div>

          <div>
            <Label className='text-sm font-semibold'>
              {t('event.form.bg_color')}
              <span className='text-red-500 px-0.5 select-none'>*</span>
            </Label>
            <div className='flex items-center'>
              <div
                className='h-8 aspect-square mr-2 rounded-lg border cursor-pointer'
                title='Click to open colour picker'
                style={{ backgroundColor: currentColor }}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') {
                    setShowColorPicker(!showColorPicker)
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowColorPicker(!showColorPicker)
                }}
              />
              {showColorPicker && (
                <div className='absolute -left-52'>
                  <HexColorPicker
                    color={currentColor}
                    onChange={(color) => {
                      handleColorChange(color)
                    }}
                  />
                </div>
              )}
              <Input
                id='background_color'
                type='text'
                placeholder='#FFFFFF'
                onChange={(e) => {
                  handleColorChange(e.currentTarget.value)
                }}
                className='mt-2 w-full'
                value={currentColor}
              />
              <EyeDropperIcon className='absolute right-8 w-5 h-5 text-neutral-500' />
            </div>
            <div id='preset-colors' className='w-full flex flex-col h-fit mt-2'>
              <Label className='w-full text-xs'>
                {t('event.form.preset_colors')}
              </Label>
              <div className='w-full h-fit flex gap-4 mt-1'>
                {presetColors.map((presetColor) => (
                  <span
                    key={presetColor.color}
                    className='w-6 h-6 cursor-pointer rounded-full'
                    style={{ backgroundColor: presetColor.color }}
                    title={presetColor.title}
                    onKeyDown={(e) => {
                      e.stopPropagation()
                      if (e.key === 'Enter') {
                        handleColorChange(presetColor.color)
                      }
                    }}
                    onClick={() => handleColorChange(presetColor.color)}
                  />
                ))}
              </div>
            </div>
            {formErrors.background_color && (
              <p className='text-red-500 text-sm mt-1'>
                {formErrors.background_color}
              </p>
            )}
          </div>

          {SUPPORTED_LANGUAGES.map((language, index) => (
            <TabsContent key={language} value={language}>
              <TranslatedInputs
                index={index}
                t={t}
                language={language}
                form={form}
                setForm={setForm}
                formErrors={formErrors}
              />
            </TabsContent>
          ))}

          <Button type='submit' className='w-full mt-4'>
            {t('event.form.publish')}
          </Button>
        </form>
      </Tabs>
      {/* TODO: Implement it, in a better UI 
      <CardFooter className='w-full h-fit mt-3 pt-3 border-t flex flex-col items-start px-0 pb-0'>
        <EventPreview
          language={language}
          currentColor={currentColor}
          translations={getValues('translations')}
        />
      </CardFooter>*/}
    </DialogContent>
  )
}
