'use client'

import Logo from 'public/images/logo.webp'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'

const FormSchema = z.object({
  image: z.instanceof(window.File),
  receptionName: z.string().optional().or(z.literal('')),
})

const MAX_FILE_SIZE = 500 * 1024
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export default function ReceptionForm({
  params: { language },
}: {
  params: { language: string }
}) {
  const [receptionPicturePreview, setReceptionPicturePreview] =
    useState<File | null>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: Logo as unknown as File,
      receptionName: '',
    },
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data)
  }

  return (
    <div className='w-full flex justify-center'>
      <Form {...form}>
        <form
          className='w-1/2 flex flex-col *:py-2'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className='text-xl font-bold border-b border-yellow-400 mb-1'>
            Reception Settings
          </h2>
          <FormField
            name='image'
            render={({ field }) => (
              <FormItem className='flex flex-col justify-around'>
                <div className='flex mb-1'>
                  <Avatar className='w-24 h-24 border-2 border-black'>
                    <AvatarImage
                      src={
                        receptionPicturePreview
                          ? URL.createObjectURL(receptionPicturePreview)
                          : Logo.src
                      }
                    />
                    <AvatarFallback>Profile Icon</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col justify-center ml-2'>
                    <FormLabel className='pb-1'>Profile Picture</FormLabel>
                    <FormDescription>
                      PNG or JPG up to 500kb
                      <br />
                      Aspect Ratio 1:1
                    </FormDescription>
                  </div>
                </div>

                <FormControl>
                  <Input
                    type='file'
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                    value={field.value ? undefined : ''}
                    onChange={(event) => {
                      const file = event.target.files
                        ? event.target.files[0]
                        : null

                      if (!file) return

                      if (file.size > MAX_FILE_SIZE) {
                        alert('File size is too large')
                        return
                      }

                      const img = new Image()
                      img.src = URL.createObjectURL(file)
                      img.onload = () => {
                        if (img.width !== img.height) {
                          alert('Aspect ratio must be 1:1')
                          return
                        }

                        field.onChange({
                          target: {
                            name: field.name,
                            value: file,
                          },
                        })
                        setReceptionPicturePreview(file)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='receptionName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reception Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed when reception mode is
                  active.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Save</Button>
        </form>
      </Form>
    </div>
  )
}
