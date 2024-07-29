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
import {
  API_BASE_URL,
  Language,
  LanguageCodes,
  LANGUAGES,
} from '@/utility/Constants'
import { useState } from 'react'
import { CardFooter } from '@/components/ui/card'
import {
  CheckIcon,
  ChevronUpDownIcon,
  EyeDropperIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import { useCalendar } from '@/providers/CalendarProvider'
import { Label } from '@/components/ui/label'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { supportedLanguages } from '@/app/i18n/settings'
import { cn } from '@/lib/utils'

function createRandomTempraryID(length: number): string {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

interface EventFormProps {
  language: string
  selectedDate: Date
  closeMenuCallback: () => void
}

export default function EventForm({
  language,
  selectedDate,
  closeMenuCallback,
}: EventFormProps) {
  const { student } = useAuthentication()

  if (!student) {
    return <></>
  }

  const [dropdownValue, setDropdownValue] = useState(
    LANGUAGES.find((l) => l.code === language)
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [currentColor, setCurrentColor] = useState('#FFFFFF')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const { addEvent } = useCalendar()
  const tinycolor = require('tinycolor2')
  const presetColors = ['#FACC15', '#111111', '#22C55E', '#3B82F6', '#EF4444']
  const FormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional().or(z.literal('')),
    date: z.string().date().min(1, 'Date is required'),
    start_time: z.string().refine((value) => {
      return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(value)
    }),
    end_time: z.string().refine((value) => {
      return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(value)
    }),
    repeats: z.boolean(),
    location: z.string().min(1, 'Location is required'),
    background_color: z.string().refine(
      (value) => {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
      },
      {
        message: 'Invalid color',
      }
    ),
  })

  const eventForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: title,
      description: '',
      date: selectedDate.toISOString().split('T')[0],
      start_time: '11:00',
      end_time: '12:00',
      repeats: false,
      location: '',
      background_color: currentColor,
    },
  })

  const { setValue } = eventForm

  const handleColorChange = (color: string) => {
    setValue('background_color', color)
    setCurrentColor(color)
  }

  const publish = async (data: z.infer<typeof FormSchema>) => {
    const start_date = new Date(data.date + ' ' + data.start_time + ':00')
    const end_date = new Date(data.date + ' ' + data.end_time + ':00')
    const json_data = {
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString(),
      background_color: data.background_color,
      location: data.location,
      author: {
        author_type: 'STUDENT',
        entity_email: student.email,
      },
      translations: [
        {
          title: data.title,
          description: data.description,
          language_code: language,
        },
      ],
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
          url: createRandomTempraryID(20),
          is_pinned: false,
          is_public: true,
          published_status: 'PUBLISHED',
          author: student,
          translations: [
            {
              title: data.title,
              main_image_url: '',
              description: data.description || '',
              language_code: 'en',
            },
          ],
        })
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
    <div>
      <Form {...eventForm}>
        <form onSubmit={eventForm.handleSubmit(publish)}>
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='w-[200px] justify-between'
                >
                  {dropdownValue ? dropdownValue.name : 'Select language...'}
                  <ChevronUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-0'>
                <Command>
                  <CommandInput placeholder='Search language...' />
                  <CommandList>
                    <CommandEmpty>No languages found.</CommandEmpty>
                    <CommandGroup>
                      {supportedLanguages.map((language) => (
                        <CommandItem
                          key={language}
                          onSelect={() => {
                            setDropdownValue(
                              LANGUAGES.find((l) => l.code === language)
                            )
                            setOpen(false)
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              'mr-2 h-4 w-4',
                              LANGUAGES.find((l) => l.code === language) ===
                                dropdownValue
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {LANGUAGES.find((l) => l.code === language)?.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button className='ml-2'>Add Language</Button>
          </div>
          <FormField
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    id='title'
                    type='text'
                    onChangeCapture={(e) => setTitle(e.currentTarget.value)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='description'
            render={({ field }) => (
              <FormItem className='mt-2'>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input
                    id='description'
                    type='text'
                    {...field}
                    placeholder='Optional'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-12 gap-2 mt-2 relative'>
            <FormField
              name='date'
              render={({ field }) => (
                <FormItem className='col-span-5'>
                  <FormLabel>Date</FormLabel>
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
                <FormItem className='col-span-3'>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input id='start_time' type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <span className='grid place-items-center relative top-4'> - </span>

            <FormField
              name='end_time'
              render={({ field }) => (
                <FormItem className='col-span-3'>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input id='end_time' type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name='repeats'
            render={({ field }) => (
              <FormItem className='flex items-center mt-1'>
                <FormControl>
                  <Checkbox id='repeats' {...field} />
                </FormControl>
                <FormLabel className='h-full ml-2 !mt-0'>Repeats</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='location'
            render={({ field }) => (
              <FormItem className='mt-2'>
                <FormLabel>Location</FormLabel>
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
                <FormLabel>Background Color</FormLabel>
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
                  <Label className='w-full text-xs'>Preset Colors</Label>
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

          <Button type='submit' className='w-full mt-4'>
            Publish
          </Button>
        </form>
      </Form>

      <CardFooter className='w-full h-fit mt-3 pt-3 border-t flex flex-col items-start px-0 pb-0'>
        <h2 className='text-lg font-semibold leading-none tracking-tight mb-2'>
          Preview
        </h2>
        <div className='w-52 h-36 border relative self-center'>
          <p className='absolute top-2 left-2 text-2xl text-neutral-400 select-none'>
            1
          </p>
          <div className='w-full absolute top-10 left-0 px-2'>
            <div
              className='w-full text-xs rounded-2xl px-2 py-0.5 h-6 border font-bold overflow-hidden'
              style={{
                backgroundColor: currentColor,
                color: tinycolor(currentColor).isDark() ? 'white' : 'black',
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
              <p className='truncate'>{title}</p>
            </div>
          </div>
        </div>
      </CardFooter>
    </div>
  )
}
