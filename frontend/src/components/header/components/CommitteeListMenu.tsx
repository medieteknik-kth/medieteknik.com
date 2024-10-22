'use client';
import { useTranslation } from '@/app/i18n/client'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { SquaresPlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import type { JSX } from "react";

interface Props {
  language: string
}

/**
 * @name CommitteeListMenu
 * @description The component that displays the list of committees in the header.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the application.
 * @returns {JSX.Element} The CommitteeListMenu component.
 */
export default function CommitteeListMenu({ language }: Props): JSX.Element {
  const { committees } = useAuthentication()
  const { t } = useTranslation(language, 'header')

  if (committees.length === 0) {
    return <></>
  }

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='flex items-center gap-2 py-2'>
            <SquaresPlusIcon className='w-4 h-4' />
            {t('committees')}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {committees.map((committee) => (
                <DropdownMenuItem key={committee.committee_id} asChild>
                  <Link
                    href={`/${language}/chapter/committees/${committee.translations[0].title.toLowerCase()}`}
                    className='w-full flex items-center gap-2 pr-2 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none py-2 cursor-pointer'
                    title={committee.translations[0].title}
                  >
                    <Avatar className='w-8 h-8 bg-white rounded-full overflow-hidden'>
                      <AvatarImage
                        className='h-8 w-auto aspect-square object-fill p-1.5'
                        width={32}
                        height={32}
                        src={committee.logo_url ?? ''}
                        alt={committee.translations[0].title}
                      />
                    </Avatar>
                    <p>{committee.translations[0].title}</p>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
    </>
  )
}
