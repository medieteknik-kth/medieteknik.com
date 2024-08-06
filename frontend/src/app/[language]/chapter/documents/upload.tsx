'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/input'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Document, DocumentTranslation } from '@/models/Document'
import { useState } from 'react'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { API_BASE_URL } from '@/utility/Constants'
import { supportedLanguages } from '@/app/i18n/settings'

function TranslatedInputs({
  index,
  currentFiles,
  setCurrentFile,
}: {
  index: number
  currentFiles: File[]
  setCurrentFile: (index: number, file: File) => void
}) {
  const ACCEPTED_FILE_TYPES = ['application/pdf']
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
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
            <FormLabel>Title</FormLabel>
            <Input id='title' placeholder='Title' {...field} />
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />

      <FormField
        name={`translations.${index}.file`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>File</FormLabel>
            <Input
              id='file'
              type='file'
              accept={ACCEPTED_FILE_TYPES.join(', ')}
              onChange={(event) => {
                const file = event.target.files ? event.target.files[0] : null

                if (!file) return

                if (file.size > MAX_FILE_SIZE) {
                  alert('File is too large')
                  event.target.value = ''
                  return
                }

                setCurrentFile(index, file)

                field.onChange({
                  target: {
                    name: field.name,
                    value: file,
                  },
                })
              }}
            />
            {currentFiles[index] && (
              <FormDescription>
                Selected file: {currentFiles[index].name}
              </FormDescription>
            )}
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />
    </>
  )
}

export default function UploadDocument({
  language,
  addDocument,
}: {
  language: string
  addDocument: (document: Document) => void
}) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [value, setValue] = useState('DOCUMENT')
  const { student } = useAuthentication()
  const [files, setFiles] = useState<File[]>([])
  const FormSchema = z.object({
    type: z.enum(['DOCUMENT', 'FORM']),
    translations: z.array(
      z.object({
        language_code: z.string().optional().or(z.literal('')),
        title: z.string().min(1, { message: 'Required' }),
        file: z.instanceof(window.File),
      })
    ),
  })

  const MAX_FILE_SIZE = 10 * 1024 * 1024

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: 'DOCUMENT',
      translations: supportedLanguages.map((language) => ({
        language_code: language,
        title: '',
      })),
    },
  })

  const postForm = async (data: z.infer<typeof FormSchema>) => {
    if (!student) {
      return
    }
    const formData = new FormData()

    // Add top-level fields
    formData.append('document_type', data.type)

    // Add author fields
    formData.append('author[author_type]', 'STUDENT')
    formData.append('author[entity_email]', student.email)

    // Add translation fields
    supportedLanguages.forEach((language, index) => {
      formData.append(`translations[${index}][language_code]`, language)
      formData.append(
        `translations[${index}][title]`,
        data.translations[index].title
      )
      formData.append(
        `translations[${index}][file]`,
        data.translations[index].file
      )
    })

    try {
      const response = await fetch(`${API_BASE_URL}/documents/`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (response.ok) {
        const json = (await response.json()) as {
          id: string
          translations: DocumentTranslation[]
        }
        addDocument({
          author: {
            author_type: 'STUDENT',
            email: student.email,
            first_name: student.first_name,
            last_name: student.last_name,
            student_id: student.student_id,
            student_type: student.student_type,
            profile_picture_url: student.profile_picture_url,
            reception_name: student.reception_name,
            reception_profile_picture_url:
              student.reception_profile_picture_url,
          },
          document_type: data.type,
          translations: json.translations,
          created_at: new Date().toISOString(),
          is_pinned: false,
          is_public: true,
          published_status: 'PUBLISHED',
        })
        setFormOpen(false)
      } else {
        setErrorMessage('Failed to upload document ' + response.statusText)
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Failed to upload document ' + error)
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

  const documentTypes = [
    {
      value: 'DOCUMENT',
      label: 'Document',
    },
    {
      value: 'FORM',
      label: 'Form',
    },
  ] as const

  return (
    <Dialog open={formOpen} onOpenChange={setFormOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className='w-6 h-6 mr-2' />
          <p>New</p>
          <span className='sr-only'>Add Document</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Max {MAX_FILE_SIZE / 1024 / 1024} MB
          </DialogDescription>
          {errorMessage && (
            <p className='text-xs font-bold text-red-600'>{errorMessage}</p>
          )}
        </DialogHeader>
        <Tabs defaultValue={language} className='mb-2'>
          <TabsList>
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
          <form onSubmit={form.handleSubmit(postForm)}>
            <Form {...form}>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem className='flex flex-col my-2'>
                    <FormLabel>Type</FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            aria-expanded={popoverOpen}
                            value={value}
                            className='w-52 justify-between'
                          >
                            {field.value
                              ? documentTypes.find((t) => t.value === value)
                                  ?.label
                              : 'Document'}
                            <ChevronDownIcon className='w-4 h-4 ml-2' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput placeholder='Search document type' />
                          <CommandEmpty>No documents found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {documentTypes.map((documentType) => (
                                <CommandItem
                                  key={documentType.value}
                                  value={documentType.value}
                                  onSelect={() => {
                                    form.setValue('type', documentType.value)
                                    setPopoverOpen(false)
                                  }}
                                >
                                  {documentType.label}
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

              {supportedLanguages.map((language, index) => (
                <TabsContent key={language} value={language}>
                  <TranslatedInputs
                    index={index}
                    currentFiles={files}
                    setCurrentFile={(index, file) =>
                      setFiles((files) => {
                        const newFiles = [...files]
                        newFiles[index] = file
                        return newFiles
                      })
                    }
                  />
                </TabsContent>
              ))}

              <Button type='submit' className='w-full my-2'>
                Upload
              </Button>
            </Form>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
