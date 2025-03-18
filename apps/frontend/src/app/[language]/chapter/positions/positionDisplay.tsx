import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { CommitteePosition } from '@/models/Committee'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import FallbackLogo from 'public/images/logo.webp'

import type { JSX } from 'react'

interface Props {
  position: CommitteePosition
}

/**
 * @name PositionDisplay
 * @description Displays a single position in the organization
 *
 * @param {Props} props
 * @param {CommitteePosition} props.position - The position to display
 *
 * @returns {JSX.Element} The position display
 */
export default function PositionDisplay({ position }: Props): JSX.Element {
  return (
    <Card id={`position-${position.email}`} className='h-full'>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center truncate'>
          {position.committee && (
            <Avatar className='p-2 bg-white'>
              <AvatarImage
                src={position.committee.logo_url}
                alt={`${position.committee.translations[0].title} Logo`}
              />
              <AvatarFallback className='p-2 bg-white'>
                <Image src={FallbackLogo} alt='' />
              </AvatarFallback>
            </Avatar>
          )}
          {position.translations[0].title}
        </CardTitle>
        <CardDescription>
          {position.email ? (
            <Link
              className='hover:underline underline-offset-4 cursor-pointer transition-all text-blue-600 dark:text-primary'
              href={`mailto:${position.email}`}
            >
              {position.email}
            </Link>
          ) : (
            'N/A'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='whitespace-pre-line text-sm'>
        {position.translations[0].description}
      </CardContent>
    </Card>
  )
}
