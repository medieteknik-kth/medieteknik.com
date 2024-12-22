import { CommitteePositionTooltip } from '@/components/tooltips/Tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import type { CommitteePosition } from '@/models/Committee'

import type { JSX } from 'react'

interface CommitteePositionTagProps {
  committeePosition: CommitteePosition
  includeImage?: boolean
  includeAt?: boolean
  children?: React.ReactNode
}

/**
 * @name CommitteePositionTag
 * @description A tag for displaying a committee position
 *
 * @param {CommitteePositionTagProps} props - The props for the component
 * @param {CommitteePosition} props.committeePosition - The committee position to display
 * @param {boolean} props.includeImage - Whether to include the image
 * @param {boolean} props.includeAt - Whether to include the @ symbol
 * @param {React.ReactNode} props.children - The children
 *
 * @returns {JSX.Element} The component
 */
export default function CommitteePositionTag({
  committeePosition,
  includeImage = false,
  includeAt = false,
  children,
}: CommitteePositionTagProps): JSX.Element {
  return (
    <HoverCard>
      <HoverCardTrigger className='flex items-center p-0 py-0.5' asChild>
        <Button
          variant='link'
          className='text-black dark:text-yellow-400 h-fit w-fit tracking-tight'
          style={{ fontSize: 'inherit' }}
          tabIndex={-1}
        >
          {includeImage && committeePosition.committee && (
            <Avatar className='w-8 h-8 mr-2 bg-white rounded-md overflow-hidden'>
              <AvatarImage
                src={committeePosition.committee.logo_url}
                className='w-full h-full object-contain p-0.5'
              />
              <AvatarFallback>
                {`${committeePosition.translations[0].title} logo`}
              </AvatarFallback>
            </Avatar>
          )}
          <p className='text-xs xs:text-sm text-start font-semibold'>
            {(includeAt ? '@ ' : '') + committeePosition.translations[0].title}
            {children}
          </p>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-fit'>
        <CommitteePositionTooltip position={committeePosition} />
      </HoverCardContent>
    </HoverCard>
  )
}
