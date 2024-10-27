'use client'
import { supportedLanguages } from '@/app/i18n/settings'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import Committee, {
  CommitteePosition,
  CommitteePositionCategory,
} from '@/models/Committee'
import { LanguageCode } from '@/models/Language'
import { Role } from '@/models/Permission'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { addPositionSchema } from '@/schemas/committee/position'
import { API_BASE_URL, LANGUAGES } from '@/utility/Constants'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
            <Input id='language' type='hidden' {...field} />
          </FormItem>
        )}
      />

      <FormField
        name={`translations.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Title{' '}
              <span className='uppercase text-xs tracking-wide'>
                [{language}]
              </span>
            </FormLabel>
            <FormControl>
              <Input id='title' placeholder='Title' {...field} />
            </FormControl>
            <FormDescription>Max 125 characters</FormDescription>
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
              <Textarea id='description' placeholder='Description' {...field} />
            </FormControl>
            <FormDescription>Max 500 characters</FormDescription>
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />
    </>
  )
}

export default function PositionForm({
  language,
  committee,
  onSuccess,
}: {
  language: string
  committee: Committee
  onSuccess: (position: CommitteePosition) => void
}) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [value, setValue] = useState('NONE')
  const { role } = useAuthentication()

  const form = useForm<z.infer<typeof addPositionSchema>>({
    resolver: zodResolver(addPositionSchema),
    defaultValues: {
      email: '',
      weight: 1000,
      category: 'NONE',
      translations: supportedLanguages.map((language) => ({
        language_code: language,
        title: '',
        description: '',
      })),
    },
  })

  const publish = async (data: z.infer<typeof addPositionSchema>) => {
    const new_data = {
      ...data,
      committee_title: committee.translations[0].title.toLowerCase(),
    }

    try {
      const response = await fetch(`${API_BASE_URL}/committee_positions/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(new_data),
      })

      if (response.ok) {
        const response_data = (await response.json()) as {
          committee_position_id: string
        }
        onSuccess({
          author_type: 'COMMITTEE_POSITION',
          active: true,
          category: new_data.category as CommitteePositionCategory,
          email: new_data.email,
          weight: new_data.weight,
          base: false,
          committee_position_id: response_data.committee_position_id,
          role: 'COMMITTEE',
          translations: new_data.translations.map((t) => ({
            title: t.title,
            description: t.description,
            language_code: t.language_code as LanguageCode,
          })),
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const categories: { value: CommitteePositionCategory; label: string }[] = [
    {
      value: 'STYRELSEN',
      label: 'Styrelsen',
    },
    {
      value: 'VALBEREDNINGEN',
      label: 'Valberedningen',
    },
    {
      value: 'UTBILDNING',
      label: 'Utbildning',
    },
    {
      value: 'NÄRINGSLIV OCH KOMMUNIKATION',
      label: 'Näringsliv och kommunikation',
    },
    {
      value: 'STUDIESOCIALT',
      label: 'Studiesocialt',
    },
    {
      value: 'FANBORGEN',
      label: 'Fanborgen',
    },
    {
      value: 'NONE',
      label: 'N/A',
    },
  ] as const

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Position</DialogTitle>
        <DialogDescription>
          Add a new position to the committee
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
              title={LANGUAGES[language].name}
            >
              <span className='w-6 h-6'>
                {LANGUAGES[language as LanguageCode].flag_icon}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <form onSubmit={form.handleSubmit(publish)}>
          <Form {...form}>
            <FormField
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {supportedLanguages.map((language, index) => (
              <TabsContent key={index} value={language}>
                <TranslatedInputs
                  index={index}
                  language={LANGUAGES[language].name}
                />
              </TabsContent>
            ))}

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='flex flex-col my-2'>
                  <FormLabel>Category</FormLabel>
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
                            ? categories.find((c) => c.value === value)?.label
                            : 'Select category'}
                          <ChevronDownIcon className='w-4 h-4 ml-2' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandInput placeholder='Search category' />
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                key={category.value}
                                value={category.value}
                                onSelect={() => {
                                  form.setValue('category', category.value)
                                  setValue(category.value)
                                  setPopoverOpen(false)
                                }}
                              >
                                {category.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {role === Role.ADMIN && (
              <FormField
                name='weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input
                        id='weight'
                        type='number'
                        placeholder='Weight'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Permission Level, leave 1000 if unsure!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type='submit' className='w-full mt-4'>
              Submit
            </Button>
          </Form>
        </form>
      </Tabs>
    </DialogContent>
  )
}
