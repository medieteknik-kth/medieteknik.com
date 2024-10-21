'use client'

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { PowerIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Props {
  language: string
}

/**
 * @name AdminButton
 * @description The component that displays the admin button in the header.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the application.
 * @returns {JSX.Element} The AdminButton component.
 */
export default function AdminButton({ language }: Props): JSX.Element {
  const { role } = useAuthentication()

  if (role !== 'ADMIN') {
    return <></>
  }

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            href={`/${language}/admin`}
            className='w-full flex items-center gap-2 pr-2 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none py-2 cursor-pointer'
            title='Admin Dashboard'
          >
            <PowerIcon className='w-4 h-4' />
            <span>Admin Dashboard</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}
