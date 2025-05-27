'use client'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Author } from '@/models/Items'
import type { LanguageCode } from '@/models/Language'
import type Document from '@/models/items/Document'
import type { DocumentTranslation } from '@/models/items/Document'
import { useStudent } from '@/providers/AuthenticationProvider'
import { documentUploadSchema } from '@/schemas/items/document'
import { LANGUAGES, SUPPORTED_LANGUAGES } from '@/utility/Constants'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { type JSX, useState } from 'react'
import { z } from 'zod/v4-mini'

interface TranslatedInputProps {
  index: number
  language: string
  currentFiles: File[]
  setCurrentFile: (index: number, file: File) => void
  form: z.infer<typeof documentUploadSchema>
  setForm: React.Dispatch<
    React.SetStateAction<z.infer<typeof documentUploadSchema>>
  >
  formErrors: {
    type: string
    translations: Record<string, { title: string; file: string }>
  }
}

interface DocumentUploadProps {
  language: LanguageCode
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
  form,
  setForm,
  formErrors,
}: TranslatedInputProps): JSX.Element {
  const ACCEPTED_FILE_TYPES = ['application/pdf']
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
  return (
    <>
      <Input id='language' type='hidden' value={language} />

      <div>
        <Label className='text-sm font-bold'>
          Title{' '}
          <span className='uppercase text-xs tracking-wide'>[{language}]</span>
        </Label>
        <Input
          id='title'
          placeholder='Title'
          onChange={(e) => {
            const newTranslations = [...form.translations]
            newTranslations[index].title = e.target.value
            setForm({ ...form, translations: newTranslations })
          }}
          value={form.translations[index].title || ''}
        />
        {formErrors.translations[language]?.title && (
          <p className='text-xs font-bold text-red-600'>
            {formErrors.translations[language].title}
          </p>
        )}
      </div>

      <div>
        <Label className='text-sm font-bold'>
          File{' '}
          <span className='uppercase text-xs tracking-wide'>[{language}]</span>
        </Label>
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

            const newTranslations = [...form.translations]
            newTranslations[index].file = file
            setForm({ ...form, translations: newTranslations })
          }}
        />
        {currentFiles[index] && (
          <p>Selected file: {currentFiles[index].name}</p>
        )}
        {formErrors.translations[language]?.file && (
          <p className='text-xs font-bold text-red-600'>
            {formErrors.translations[language].file}
          </p>
        )}
      </div>
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
  const { student } = useStudent()
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState<z.infer<typeof documentUploadSchema>>({
    type: 'DOCUMENT',
    translations: SUPPORTED_LANGUAGES.map((lang) => ({
      language_code: lang,
      title: '',
      file: new File([], ''),
    })),
  })
  const [formErrors, setFormErrors] = useState({
    type: '',
    translations: SUPPORTED_LANGUAGES.reduce(
      (acc, lang) => {
        acc[lang] = { title: '', file: '' }
        return acc
      },
      {} as Record<LanguageCode, { title: string; file: string }>
    ),
  })

  const MAX_FILE_SIZE = 10 * 1024 * 1024

  const submit = async (data: z.infer<typeof documentUploadSchema>) => {
    if (!student) {
      setErrorMessage('Must be logged in to upload a document.')
      return
    }

    const errors = documentUploadSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        type: fieldErrors.properties?.type?.errors[0] || '',
        translations:
          fieldErrors.properties?.translations?.items?.reduce(
            (acc, item, index) => {
              acc[SUPPORTED_LANGUAGES[index]] = {
                title: item.properties?.title?.errors[0] || '',
                file: item.properties?.file?.errors[0] || '',
              }
              return acc
            },
            {} as Record<LanguageCode, { title: string; file: string }>
          ) || ({} as Record<LanguageCode, { title: string; file: string }>),
      })
    }

    const formData = new FormData()

    // Add top-level fields
    formData.append('document_type', data.type)

    // Add author fields
    formData.append('author[author_type]', author.author_type)
    formData.append('author[email]', author.email || '')

    // Add translation fields
    SUPPORTED_LANGUAGES.forEach((language, index) => {
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
      const response = await fetch('/api/documents', {
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
        setErrorMessage(`Failed to upload document: ${response.statusText}`)
      }
    } catch (error) {
      console.error(error)
      setErrorMessage(`Failed to upload document: ${error}`)
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

  if (!student) {
    return (
      <DialogContent>Must be logged in to upload a document.</DialogContent>
    )
  }

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
        <Label>Language</Label>
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
          <div>
            <Label className='text-sm font-bold'>Type</Label>
            <Popover
              modal={popoverOpen}
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                  role='combobox'
                  aria-expanded={popoverOpen}
                  value={value}
                  className='w-52 justify-between'
                >
                  {form.type
                    ? documentTypes.find((t) => t.value === value)?.label
                    : 'Document'}
                  <ChevronDownIcon className='w-4 h-4 ml-2' />
                </Button>
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
                            setForm({
                              ...form,
                              type: documentType.value,
                            })
                            setValue(documentType.value)
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
            {formErrors.type && (
              <p className='text-xs font-bold text-red-600'>
                {formErrors.type}
              </p>
            )}
          </div>

          {SUPPORTED_LANGUAGES.map((language, index) => (
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
                form={form}
                setForm={setForm}
                formErrors={formErrors}
              />
            </TabsContent>
          ))}

          <Button type='submit' className='w-full my-2'>
            Upload
          </Button>
        </form>
      </Tabs>
    </DialogContent>
  )
}
