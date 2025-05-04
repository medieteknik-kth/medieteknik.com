'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExpenseBadge } from '@/components/ui/expense-badge'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'

interface Props {
  language: LanguageCode
}

export default function CreateButton({ language }: Props) {
  const { isAuthenticated } = useAuthentication()

  if (!isAuthenticated) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='rounded-full md:hidden overflow-hidden h-[4.5rem] w-[4.5rem] flex items-center hover:opacity-100 transition-opacity duration-500 ease-in-out col-start-3'>
          <PlusIcon className='w-6 h-6' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='grid grid-cols-2 gap-2'>
        <DropdownMenuItem asChild>
          <Link
            href={`/${language}/upload?template=expense`}
            className='w-32 h-24 cursor-pointer'
          >
            <ExpenseBadge
              language={language}
              type='expense'
              className='w-full h-full flex flex-col justify-center gap-2'
            />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/${language}/upload?template=invoice`}
            className='w-32 h-24 cursor-pointer'
          >
            <ExpenseBadge
              language={language}
              type='invoice'
              className='w-full h-full flex flex-col justify-center gap-2'
            />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
