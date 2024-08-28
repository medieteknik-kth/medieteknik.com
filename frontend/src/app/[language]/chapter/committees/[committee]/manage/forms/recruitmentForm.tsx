'use client'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { supportedLanguages } from '@/app/i18n/settings'
import Committee, { CommitteePosition } from '@/models/Committee'
import useSWR from 'swr'
import { API_BASE_URL } from '@/utility/Constants'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

function TranslatedInputs({
  index,
  language,
}: {
  index: number
  language: string
}) {
  return (
    <>
      <FormField
        name={`translations.${index}.language_code`}
        render={({ field }) => (
          <FormItem>
            <Input {...field} type='hidden' />
          </FormItem>
        )}
      />

      <FormField
        name={`translations.${index}.link`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Link{' '}
              <span className='uppercase text-xs tracking-wide'>
                [{language}]
              </span>
            </FormLabel>
            <FormControl>
              <Input {...field} type='url' placeholder='https://example.com' />
            </FormControl>
            <FormDescription>Max 512 characters</FormDescription>
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />

      <FormField
        name={`translations.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Description{' '}
              <span className='uppercase text-xs tracking-wide'>
                [{language}]
              </span>
            </FormLabel>
            <FormControl>
              <Input {...field} type='text' placeholder='Description' />
            </FormControl>
            <FormDescription>Max 200 characters</FormDescription>
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />
    </>
  )
}

export default function RecruitmentForm({ language }: { language: string }) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { positions } = useCommitteeManagement()

  if (!positions) {
    throw new Error('Positions not found')
  }

  const [value, setValue] = useState(positions[0].translations[0].title)

  const dropdownOptions = positions.map((position) => ({
    value: position.translations[0].title,
    label: position.translations[0].title
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' '),
  }))

  const RecruitmentSchema = z
    .object({
      position: z.string(),
      start_date: z.coerce.date().refine((date) => date >= new Date(), {
        message: 'Start date must be today or later',
      }),
      end_date: z.coerce.date().refine((date) => date >= new Date(), {
        message: 'Start date must be today or later',
      }),
      translations: z
        .array(
          z.object({
            language_code: z.string().optional().or(z.literal('')),
            link: z.string().url().max(512),
            description: z.string().max(200),
          })
        )
        .min(1),
    })
    .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
      message: 'End date must be after start date',
      path: ['end_date'],
    })

  const form = useForm<z.infer<typeof RecruitmentSchema>>({
    resolver: zodResolver(RecruitmentSchema),
    defaultValues: {
      position: 'MEMBER',
      start_date: new Date(),
      end_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      translations: supportedLanguages.map((language) => ({
        language_code: language,
        link: '',
        description: '',
      })),
    },
  })

  const publish = async (data: z.infer<typeof RecruitmentSchema>) => {
    const position = positions.find(
      (p) =>
        p.translations[0].title.toLowerCase() === data.position.toLowerCase()
    )
    if (!position) {
      throw new Error('Position not found')
    }

    const response = await fetch(
      `${API_BASE_URL}/committee_positions/${position.committee_position_id}/recruit`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to recruit position')
    }
  }

  const languageFlags = new Map([
    ['en', 'gb'],
    ['sv', 'se'],
  ])

  const languageNames = new Map([
    ['en', 'English'],
    ['sv', 'Svenska'],
  ])

  /**
   * A function that retrieves the flag code based on the provided language.
   *
   * @param {string} lang - The language code for which to retrieve the flag code.
   * @return {string} The corresponding flag code for the language, defaulting to 'xx' if not found.
   */
  const getFlagCode = (lang: string): string => {
    return languageFlags.get(lang) || 'xx'
  }

  /**
   * A function that retrieves the language name based on the provided language code.
   *
   * @param {string} lang - The language code for which to retrieve the language name.
   * @return {string} The corresponding language name, defaulting to 'Unknown' if not found.
   */
  const getLanguageName = (lang: string): string => {
    return languageNames.get(lang) || 'Unknown'
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Recruit Position</DialogTitle>
        <DialogDescription>
          Fill in the details to recruit a new position
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue={language}>
        <Label>Language</Label>
        <TabsList className='overflow-x-auto w-full justify-start'>
          {supportedLanguages.map((language) => (
            <TabsTrigger
              key={language}
              value={language}
              className='w-fit'
              title={getLanguageName(language)}
            >
              <span className={`fi fi-${getFlagCode(language)}`} />
            </TabsTrigger>
          ))}
        </TabsList>

        <form onSubmit={form.handleSubmit(publish)}>
          <Form {...form}>
            <FormField
              control={form.control}
              name='position'
              render={({ field }) => (
                <FormItem className='flex flex-col my-2'>
                  <FormLabel>Position</FormLabel>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          aria-expanded={popoverOpen}
                          value={value}
                          className='w-72 justify-between'
                        >
                          {field.value
                            ? dropdownOptions.find((p) => p.value === value)
                                ?.label
                            : 'Select position'}
                          <ChevronDownIcon className='w-4 h-4 ml-2' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandInput placeholder='Search positions...' />
                        <CommandEmpty>No positions available</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {dropdownOptions.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={() => {
                                  form.setValue('position', option.value)
                                  setValue(option.value)
                                  setPopoverOpen(false)
                                }}
                              >
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage className='text-xs font-bold' />
                </FormItem>
              )}
            />

            <FormField
              name='start_date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input {...field} type='datetime-local' />
                  </FormControl>
                  <FormMessage className='text-xs font-bold' />
                </FormItem>
              )}
            />

            <FormField
              name='end_date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input {...field} type='datetime-local' />
                  </FormControl>
                  <FormMessage className='text-xs font-bold' />
                </FormItem>
              )}
            />

            {supportedLanguages.map((language, index) => (
              <TabsContent key={index} value={language}>
                <TranslatedInputs
                  index={index}
                  language={getLanguageName(language)}
                />
              </TabsContent>
            ))}

            <Button type='submit' className='w-full mt-4'>
              Submit
            </Button>
          </Form>
        </form>
      </Tabs>
    </DialogContent>
  )
}
