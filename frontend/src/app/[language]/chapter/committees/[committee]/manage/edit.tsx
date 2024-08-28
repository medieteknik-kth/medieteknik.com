'use client'
import { Button } from '@/components/ui/button'
import Committee from '@/models/Committee'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supportedLanguages } from '@/app/i18n/settings'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import { API_BASE_URL, LANGUAGES } from '@/utility/Constants'
import { useState } from 'react'

/**
 * @name TranslatedInputs
 * @description A component for rendering the translated inputs for a committee.
 *
 * @param {number} index - The index of the translation
 * @param {string} language - The language of the translation
 * @returns {JSX.Element} The rendered component
 */
function TranslatedInputs({
  index,
  language,
}: {
  index: number
  language: string
}): JSX.Element {
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
        name={`translations.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Description{' '}
              <span className='uppercase text-xs tracking-wide select-none'>
                [{language}]
              </span>
            </FormLabel>
            <Input id='description' placeholder='Description' {...field} />
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />
    </>
  )
}

/**
 * @name EditCommittee
 * @description A component for editing the public details of a committee.
 *
 * @param {string} language - The language of the page
 * @param {Committee} committee - The committee to edit
 * @returns {JSX.Element} The rendered component
 */
export default function EditCommittee({
  language,
  committee,
}: {
  language: string
  committee: Committee
}): JSX.Element {
  // TODO: Add permissions
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const EditCommitteeSchema = z.object({
    title: z
      .string()
      .min(3, { message: 'Title is required' })
      .max(125, { message: 'Title is too long' }),
    translations: z.array(
      z.object({
        language_code: z.string().optional().or(z.literal('')),
        description: z
          .string()
          .min(1, { message: 'Description is required' })
          .max(500, { message: 'Description is too long' }),
      })
    ),
    logo: z.instanceof(window.File).optional().or(z.literal('')),
    group_photo: z.instanceof(window.File).optional().or(z.literal('')),
  })

  const form = useForm<z.infer<typeof EditCommitteeSchema>>({
    resolver: zodResolver(EditCommitteeSchema),
    defaultValues: {
      title: committee.translations[0].title,
      translations: supportedLanguages.map((lang, index) => ({
        language_code: lang,
        description:
          committee.translations.find(
            (t) => t.language_code.split('-')[0] === lang
          )?.description || '',
      })),
    },
  })

  const MAX_LOGO_FILE_SIZE = 1 * 1024 * 1024 // 1 MB
  const MAX_GROUP_PHOTO_FILE_SIZE = 15 * 1024 * 1024 // 15 MB

  const postForm = async (data: z.infer<typeof EditCommitteeSchema>) => {
    const formData = new FormData()

    // Add top-level fields
    if (data.logo) {
      formData.append('logo', data.logo)
    }

    if (data.group_photo) {
      formData.append('group_photo', data.group_photo)
    }

    // Add translation fields
    supportedLanguages.map((language, index) => {
      formData.append(`translations[${index}][language_code]`, language)
      formData.append(`translations[${index}][title]`, data.title)
      formData.append(
        `translations[${index}][description]`,
        data.translations[index].description
      )
    })

    try {
      const response = await fetch(
        `${API_BASE_URL}/committees/${committee.translations[0].title.toLowerCase()}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        }
      )

      if (response.ok) {
        setOpen(false)
      } else {
        console.error(response)
        setErrorMessage('Something went wrong. Please try again later.')
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Something went wrong. Please try again later.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          title='Edit the public details of the committee.'
        >
          <PencilSquareIcon className='w-6 h-6 mr-2' />
          <p>Edit Public Details</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Committee</DialogTitle>
          <DialogDescription>
            Edit the public details of the committee.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={language}>
          <TabsList>
            {supportedLanguages.map((language) => (
              <TabsTrigger key={language} value={language}>
                <span className={`fi fi-${LANGUAGES[language].flag}`} />
              </TabsTrigger>
            ))}
          </TabsList>
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          <div>
            <Label>Email</Label>
            <Input
              value={committee.email}
              disabled
              readOnly
              title='Contact an administrator to change the email.'
            />
          </div>
          <form onSubmit={form.handleSubmit(postForm)}>
            <Form {...form}>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Title</FormLabel>
                    <Input id='title' placeholder='Title' {...field} />
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />

              {supportedLanguages.map((language, index) => (
                <TabsContent key={language} value={language}>
                  <TranslatedInputs
                    index={index}
                    language={LANGUAGES[language].name}
                  />
                </TabsContent>
              ))}

              <FormField
                control={form.control}
                name='logo'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Logo</FormLabel>
                    <Input
                      id='logo'
                      accept='image/svg+xml'
                      type='file'
                      onChange={(event) => {
                        const file = event.target.files
                          ? event.target.files[0]
                          : null

                        if (!file) return

                        if (file.size > MAX_LOGO_FILE_SIZE) {
                          alert('File is too large')
                          event.target.value = ''
                          return
                        }

                        field.onChange({
                          target: {
                            name: field.name,
                            value: file,
                          },
                        })
                      }}
                    />
                    <FormDescription>
                      Max file size 1MB. SVG only.
                    </FormDescription>
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='group_photo'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Group Photo</FormLabel>
                    <Input
                      id='logo'
                      accept='image/*'
                      type='file'
                      onChange={(event) => {
                        const file = event.target.files
                          ? event.target.files[0]
                          : null

                        if (!file) return

                        if (file.size > MAX_GROUP_PHOTO_FILE_SIZE) {
                          alert('File is too large')
                          event.target.value = ''
                          return
                        }

                        field.onChange({
                          target: {
                            name: field.name,
                            value: file,
                          },
                        })
                      }}
                    />
                    <FormDescription>Max file size 15MB.</FormDescription>
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                Save
              </Button>
            </Form>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
