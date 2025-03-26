'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import { PowerIcon } from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'

import type { JSX } from 'react'

interface Props {
  language: LanguageCode
}

/**
 * @name AdminButton
 * @description The component that displays the admin button in the header.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the application.
 *
 * @returns {JSX.Element} The AdminButton component.
 */
export default function AdminButton({ language }: Props): JSX.Element {
  const { role } = useStudent()

  if (role !== 'ADMIN') {
    return <></>
  }

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className='p-0'>
          <Button
            variant={'ghost'}
            className='w-full flex items-center justify-start gap-2 p-0 pl-2'
            asChild
          >
            <Link href={`/${language}/admin`} title='Admin Dashboard'>
              <PowerIcon className='w-4 h-4' />
              <span>Admin Dashboard</span>
            </Link>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}
