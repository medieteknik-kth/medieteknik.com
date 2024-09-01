'use client'
import { Button } from '@/components/ui/button'
import Committee from '@/models/Committee'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Props {
  language: string
  committee: Committee
}
export default function ManageButton({ language, committee }: Props) {
  const { committees, role } = useAuthentication()
  return (
    <div className='p-0.5 w-16 aspect-square'>
      {(committees.some((c) => c.email === committee.email) ||
        role === 'ADMIN') && (
        <Button size={'icon'} className='w-full h-full' title='Manage' asChild>
          <Link
            href={`/${language}/chapter/committees/${committee.translations[0].title.toLowerCase()}/manage`}
          >
            <Cog8ToothIcon className='w-8 h-8' />
          </Link>
        </Button>
      )}
    </div>
  )
}
//
