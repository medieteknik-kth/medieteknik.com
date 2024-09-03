'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@/components/ui/checkbox'
import { HexColorPicker } from 'react-colorful'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { API_BASE_URL, LANGUAGES } from '@/utility/Constants'
import { useState } from 'react'
import { CardFooter } from '@/components/ui/card'
import { EyeDropperIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Label } from '@/components/ui/label'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { supportedLanguages } from '@/app/i18n/settings'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import { useTranslation } from '@/app/i18n/client'
import { TFunction } from 'next-i18next'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Author, Event } from '@/models/Items'
import { LanguageCode } from '@/models/Language'

interface TranslatedInputProps {
  index: number
  language: string
  t: TFunction
}

interface EventFormProps {
  language: string
  selectedDate: Date
  closeMenuCallback: () => void
  author: Author
  addEvent?: (event: Event) => void
}

/**
 * @name TranslatedInputs
 * @description Inputs for translated fields
 *
 * @param {TranslatedInputProps} props - The props for the component
 * @param {number} props.index - The index of the input
 * @param {string} props.language - The language of the input
 * @param {TFunction} props.t - The translation function
 * @returns {JSX.Element} The translated inputs
 */
function TranslatedInputs({
  index,
  language,
  t,
}: TranslatedInputProps): JSX.Element {
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
              <Input
                id='description'
                type='text'
                placeholder='Optional'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

/**
 * @name EventUpload
 * @description Upload an event
 *
 * @param {EventFormProps} props - The props for the component
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
}: EventFormProps): JSX.Element {
  const { student } = useAuthentication()
  const { t } = useTranslation(language, 'bulletin')

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [currentColor, setCurrentColor] = useState('#FFFFFF')
  const tinycolor = require('tinycolor2')
  const presetColors = ['#FACC15', '#111111', '#22C55E', '#3B82F6', '#EF4444']
  const FormSchema = z
    .object({
      date: z.string().date().min(1, 'Date is required'),
      start_time: z.string().time(),
      end_time: z.string().time(),
      repeats: z.boolean().optional().or(z.literal(false)),
      location: z.string().min(1, 'Location is required'),
      background_color: z.string().refine(
        (value) => {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
        },
        {
          message: 'Invalid color',
        }
      ),
      translations: z.array(
        z.object({
          language_code: z.string().optional().or(z.literal('')),
          title: z.string().min(1, 'Title is required'),
          description: z.string().optional().or(z.literal('')),
        })
      ),
    })
    .refine(
      (data) =>
        data.end_time.valueOf() > data.start_time.valueOf() + 1 * 60 * 1000,
      {
        message: 'End time must be after start time',
        path: ['end_time'],
      }
    )

  const eventForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      translations: supportedLanguages.map((language) => {
        return {
          language_code: language,
          title: '',
          description: '',
        }
      }),
      date: selectedDate.toISOString().split('T')[0],
      start_time: '11:00:00',
      end_time: '12:00:00',
      repeats: false,
      location: '',
      background_color: currentColor,
    },
  })

  const { setValue, getValues } = eventForm

  if (!student) {
    return <></>
  }

  const handleColorChange = (color: string) => {
    setValue('background_color', color)
    setCurrentColor(color)
  }

  const publish = async (data: z.infer<typeof FormSchema>) => {
    const start_date = new Date(data.date + ' ' + data.start_time)
    const end_date = new Date(data.date + ' ' + data.end_time)

    const json_data = {
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString(),
      background_color: data.background_color,
      location: data.location,
      author: author,
      translations: data.translations,
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(json_data),
      })

      if (response.ok) {
        if (addEvent) {
          addEvent({
            start_date: start_date.toLocaleString(language, {
              timeZone: 'Europe/Stockholm',
            }),
            end_date: end_date.toLocaleString(language, {
              timeZone: 'Europe/Stockholm',
            }),
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

  return (
    <DialogContent className='h-fit'>
      <DialogHeader>
        <DialogTitle>{t('event.form.title')}</DialogTitle>
        <DialogDescription>{t('event.form.description')}</DialogDescription>
      </DialogHeader>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      <Tabs defaultValue={language} className='mb-2'>
        <Label>{t('event.form.language')}</Label>
        <TabsList className='overflow-x-auto w-full justify-start'>
          {supportedLanguages.map((language) => (
            <TabsTrigger
              key={language}
              value={language}
              className='w-fit'
              title={LANGUAGES[language].name}
            >
              <span className={`fi fi-${LANGUAGES[language].flag}`} />
            </TabsTrigger>
          ))}
        </TabsList>
        <form onSubmit={eventForm.handleSubmit(publish)}>
          <Form {...eventForm}>
            <div className='grid grid-cols-2 grid-rows-2 gap-2 mt-2 relative'>
              <FormField
                name='date'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>{t('event.form.date')}</FormLabel>
                    <FormControl>
                      <Input id='date' type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name='start_time'
                render={({ field }) => (
                  <FormItem className='col-span-1'>
                    <FormLabel>{t('event.form.start_time')}</FormLabel>
                    <FormControl>
                      <Input id='start_time' type='time' step={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name='end_time'
                render={({ field }) => (
                  <FormItem className='col-span-1'>
                    <FormLabel>{t('event.form.end_time')}</FormLabel>
                    <FormControl>
                      <Input id='end_time' type='time' step={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name='repeats'
              disabled
              render={({ field }) => (
                <FormItem className='flex items-center mt-1'>
                  <FormControl>
                    <Checkbox id='repeats' {...field} />
                  </FormControl>
                  <FormLabel className='h-full ml-2 !mt-0'>
                    {t('event.form.repeats')}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='location'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel>{t('event.form.location')}</FormLabel>
                  <div className='relative'>
                    <FormControl>
                      <Input id='location' type='text' {...field} />
                    </FormControl>
                    <MapPinIcon className='absolute top-0 bottom-0 my-auto right-2 w-5 h-5 text-neutral-500' />
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='background_color'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel>{t('event.form.bg_color')}</FormLabel>
                  <div className='flex items-center'>
                    <div
                      className='h-8 aspect-square mr-2 rounded-lg border cursor-pointer'
                      title='Click to open color picker'
                      style={{ backgroundColor: currentColor }}
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
                    <FormControl>
                      <Input
                        id='background_color'
                        type='text'
                        placeholder='#FFFFFF'
                        onChangeCapture={(e) => {
                          handleColorChange(e.currentTarget.value)
                        }}
                        {...field}
                      />
                    </FormControl>
                    <EyeDropperIcon className='absolute right-8 w-5 h-5 text-neutral-500' />
                  </div>
                  <div
                    id='preset-colors'
                    className='w-full flex flex-col h-fit mt-2'
                  >
                    <Label className='w-full text-xs'>
                      {t('event.form.preset_colors')}
                    </Label>
                    <div className='w-full h-fit flex gap-4 mt-1'>
                      {presetColors.map((color) => (
                        <div
                          key={color}
                          className='w-6 h-6 cursor-pointer rounded-full'
                          style={{ backgroundColor: color }}
                          title={color}
                          onClick={() => handleColorChange(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            {supportedLanguages.map((language, index) => (
              <TabsContent key={language} value={language}>
                <TranslatedInputs
                  index={index}
                  t={t}
                  language={LANGUAGES[language].name}
                />
              </TabsContent>
            ))}

            <Button type='submit' className='w-full mt-4'>
              {t('event.form.publish')}
            </Button>
          </Form>
        </form>
      </Tabs>

      <CardFooter className='w-full h-fit mt-3 pt-3 border-t flex flex-col items-start px-0 pb-0'>
        <h2 className='text-lg font-semibold leading-none tracking-tight mb-2'>
          {t('event.form.preview')}
        </h2>
        <div className='w-52 min-h-36 h-fit border relative self-center'>
          <p className='absolute top-2 left-2 text-2xl text-neutral-400 select-none'>
            1
          </p>
          <div className='w-full h-fit relative top-10 mb-12 left-0 px-2 flex flex-col gap-1'>
            {getValues('translations').map((translation, index) => (
              <div
                key={index}
                className={`w-full text-xs rounded-2xl px-2 py-0.5 h-6 border font-bold overflow-hidden ${
                  tinycolor(currentColor).isDark() ? 'text-white' : 'text-black'
                }`}
                style={{
                  backgroundColor: currentColor,
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation()
                  const bg = tinycolor(currentColor)
                  if (bg.isDark()) {
                    e.currentTarget.style.backgroundColor = bg
                      .lighten(10)
                      .toString()
                  } else {
                    e.currentTarget.style.backgroundColor = bg
                      .darken(10)
                      .toString()
                  }
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation()
                  e.currentTarget.style.backgroundColor = currentColor
                }}
              >
                <div className='w-2 absolute -left-6'>
                  <span
                    className={`fi fi-${
                      LANGUAGES[translation.language_code as LanguageCode].flag
                    } mr-1`}
                  />
                </div>
                <p className='truncate'>{translation.title}</p>
              </div>
            ))}
          </div>
        </div>
      </CardFooter>
    </DialogContent>
  )
}
