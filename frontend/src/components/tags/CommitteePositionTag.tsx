import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Button } from '@components/ui/button'
import { CommitteePosition } from '@/models/Committee'

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
  includeImage = true,
  includeAt = true,
  children,
}: CommitteePositionTagProps): JSX.Element {
  return (
    <HoverCard>
      <HoverCardTrigger className='flex items-center' asChild>
        <Button
          variant='link'
          className='text-black dark:text-yellow-400 pl-0'
          style={{ fontSize: 'inherit' }}
          tabIndex={-1}
        >
          {includeImage && (
            <Avatar className='w-8 h-8 mr-2'>
              <AvatarImage
                src={committeePosition.committee?.logo_url ?? ''}
                alt={committeePosition.translations[0].title}
              />
              <AvatarFallback>
                {committeePosition.translations[0].title + ' Profile Picture'}
              </AvatarFallback>
            </Avatar>
          )}
          <p>
            {(includeAt ? '@ ' : '') + committeePosition.translations[0].title}
            {children}
          </p>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        {/*<CommitteePositionTooltip  position={committeePosition} />*/}
      </HoverCardContent>
    </HoverCard>
  )
}
