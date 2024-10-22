import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CommitteePosition } from '@/models/Committee'

import type { JSX } from "react";

interface Props {
  language: string
  position: CommitteePosition
}

/**
 * @name PositionDisplay
 * @description Displays a single position in the organization
 *
 * @param {Props} props
 * @param {string} props.language - The current language
 * @param {CommitteePosition} props.position - The position to display
 *
 * @returns {JSX.Element} The position display
 */
export default function PositionDisplay({ language, position }: Props): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center truncate'>
          {position.committee && (
            <Avatar className='p-2 bg-white'>
              <AvatarImage src={position.committee.logo_url} />
              <AvatarFallback>Fallback</AvatarFallback>
            </Avatar>
          )}
          {position.translations[0].title}
        </CardTitle>
        <CardDescription>{position.email || 'N/A'}</CardDescription>
      </CardHeader>
      <CardContent className='whitespace-pre-line text-sm'>
        {position.translations[0].description}
      </CardContent>
    </Card>
  )
}
