'use client'

import { Button } from '@/components/ui/button'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { Link } from 'next-view-transitions'

interface Props {
  language: LanguageCode
}

export default function AuthenticatedNavigation({ language }: Props) {
  const { isAuthenticated } = useAuthentication()

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Button variant={'ghost'} asChild className='uppercase h-full bg-inherit'>
        <Link href={`/${language}/upload?template=expense`}>New Expense</Link>
      </Button>

      <Button variant={'ghost'} asChild className='uppercase h-full bg-inherit'>
        <Link href={`/${language}/upload?template=invoice`}>New Invoice</Link>
      </Button>

      <Button variant='ghost' asChild className='uppercase h-full bg-inherit'>
        <Link href={`/${language}/account?category=activity`}>
          Your Uploads
        </Link>
      </Button>
    </>
  )
}
