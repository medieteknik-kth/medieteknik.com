'use client'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { API_BASE_URL } from '@/utility/Constants'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Loading from '@/components/tooltips/Loading'

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then((res) => res.json())

export default function LoginForm({ language }: { language: string }) {
  const [errorMessage, setErrorMessage] = useState('')
  const [rendering, setRendering] = useState(true)
  const { data, error, isLoading } = useSWR(
    `http://localhost:8000/csrf-token`,
    fetcher
  )

  const FormSchema = z.object({
    email: z
      .string()
      .min(1, { message: 'Please enter your email address' })
      .email({ message: 'Please enter a valid email address' })
      .refine(
        (email) => {
          return email.includes('@kth.se')
        },
        {
          message: 'Please enter a valid student email address (@kth.se)',
        }
      ),
    password: z
      .string()
      .min(1, { message: 'Please enter your password' })
      .min(4, { message: 'Password must be at least 8 characters' }),

    csrf_token: z.string().optional().or(z.literal('')),
  })

  const loginForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      csrf_token: '',
    },
  })

  const { setValue } = loginForm

  if (error) {
    return (
      <p className='text-red-500 font-bold mb-2 text-xl text-center'>
        {error.message}
      </p>
    )
  }

  if (isLoading) {
    return <Loading language={language} />
  }

  const submit = async (formData: z.infer<typeof FormSchema>) => {
    const response = await fetch(`${API_BASE_URL}/students/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': data.token,
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      const json = await response.json()

      if (json) {
        window.location.href = `${window.location.origin}/${language}`
      }
    } else {
      setErrorMessage('Invalid Crendentials')
    }
  }

  return (
    <div className='w-full'>
      {errorMessage && (
        <p className='text-red-500 font-bold mb-2 text-xl text-center'>
          {errorMessage}
        </p>
      )}
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(submit)}>
          <FormField
            name='email'
            render={({ field }) => (
              <FormItem className='w-full mb-4'>
                <FormLabel className='text-xl'>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' autoComplete='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xl'>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Password'
                    autoComplete='current-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='csrf_token'
            render={({ field }) => (
              <FormItem>
                <input type='hidden' {...field} />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className='w-full mt-4'
            onClick={() => {
              setValue('csrf_token', data.token)
            }}
          >
            Login
          </Button>
        </form>
      </Form>
    </div>
  )
}
