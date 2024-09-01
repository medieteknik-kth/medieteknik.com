'use client'
import { Button } from '@/components/ui/button'
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
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
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
import { API_BASE_URL, LANGUAGES } from '@/utility/Constants'
import { supportedLanguages } from '@/app/i18n/settings'
import { Author } from '@/models/Items'

interface TranslatedInputProps {
  index: number
  language: string
  currentFiles: File[]
  setCurrentFile: (index: number, file: File) => void
}

interface DocumentUploadProps {
  language: string
  author: Author
  addDocument: (document: Document) => void
  closeMenuCallback: () => void
}

/**
 * @name TranslatedInputs
 * @description Inputs for translated fields
 *
 * @param {TranslatedInputProps} props - The props for the component
 * @param {number} props.index - The index of the input
 * @param {string} props.language - The language of the input
 * @param {File[]} props.currentFiles - The current files
 * @param {(index: number, file: File) => void} props.setCurrentFile - The function to set the current file
 * @returns {JSX.Element} The translated inputs
 */
function TranslatedInputs({
  index,
  language,
  currentFiles,
  setCurrentFile,
}: TranslatedInputProps): JSX.Element {
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
            <FormLabel>
              Title{' '}
              <span className='uppercase text-xs tracking-wide'>
                [{language}]
              </span>
            </FormLabel>
            <Input id='title' placeholder='Title' {...field} />
            <FormMessage className='text-xs font-bold' />
          </FormItem>
        )}
      />

      <FormField
        name={`translations.${index}.file`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              File{' '}
              <span className='uppercase text-xs tracking-wide select-none'>
                [{language}]
              </span>
            </FormLabel>
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

/**
 * @name DocumentUpload
 * @description Upload a document
 *
 * @param {DocumentUploadProps} props - The props for the component
 * @param {string} props.language - The language of the document
 * @param {Author} props.author - The author of the document
 * @param {(document: Document) => void} props.addDocument - The callback function to add the document
 * @param {() => void} props.closeMenuCallback - The callback function to close the menu
 * @returns {JSX.Element} The document upload form
 */
export default function DocumentUpload({
  language,
  author,
  addDocument,
  closeMenuCallback,
}: DocumentUploadProps): JSX.Element {
  const [popoverOpen, setPopoverOpen] = useState(false)
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
    formData.append('author[author_type]', author.author_type)
    formData.append('author[email]', author.email || '')

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
          author: author,
          document_type: data.type,
          translations: json.translations,
          created_at: new Date().toISOString(),
          is_pinned: false,
          is_public: true,
          published_status: 'PUBLISHED',
          document_id: json.id,
        })
        closeMenuCallback()
      } else {
        setErrorMessage('Failed to upload document ' + response.statusText)
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Failed to upload document ' + error)
    }
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
              title={LANGUAGES[language].name}
            >
              <span className={`fi fi-${LANGUAGES[language].flag}`} />
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
                  language={LANGUAGES[language].name}
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
  )
}
