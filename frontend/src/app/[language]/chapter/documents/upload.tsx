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
import { Document, DocumentType } from '@/models/Document'
import { useState } from 'react'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { API_BASE_URL, LanguageCodes } from '@/utility/Constants'

export default function UploadDocument({ language }: { language: string }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('DOCUMENT')
  const { student } = useAuthentication()
  const FormSchema = z.object({
    title: z.string().min(1, { message: 'Required' }),
    type: z.enum(['DOCUMENT', 'FORM']),
    file: z.instanceof(window.File),
  })

  const MAX_FILE_SIZE = 10 * 1024 * 1024
  const ACCEPTED_FILE_TYPES = [
    'application/pdf',
    'application/rtf',
    'text/plain',
    'application/x-latex',
    'application/x-tex',
    'text/markdown',
    'text/html',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'text/csv',
  ]

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      type: 'DOCUMENT',
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
    formData.append('translations[0][file]', data.file)
    formData.append('translations[0][title]', data.title)
    formData.append('translations[0][language_code]', language)

    try {
      const response = await fetch(`${API_BASE_URL}/documents/`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.error(error)
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
    <Dialog>
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
        </DialogHeader>
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(postForm)}>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Title' {...field} />
                    </FormControl>
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem className='flex flex-col my-2'>
                    <FormLabel>Type</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            aria-expanded={open}
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
                                    setOpen(false)
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

              <FormField
                name='file'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        accept={ACCEPTED_FILE_TYPES.join(', ')}
                        value={field.value ? undefined : ''}
                        onChange={(event) => {
                          const file = event.target.files
                            ? event.target.files[0]
                            : null

                          if (!file) return

                          if (file.size > MAX_FILE_SIZE) {
                            alert('File is too large')
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
                    </FormControl>
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full my-2'>
                Upload
              </Button>
            </form>
          </Form>
        </>
      </DialogContent>
    </Dialog>
  )
}
