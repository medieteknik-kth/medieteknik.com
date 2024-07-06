import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  CommitteePositionTooltip,
  CommitteeTooltip,
} from '@components/tooltips/Tooltip'
import { Button } from '@components/ui/button'
import { CommitteePosition } from '@/models/Committee'

export default function CommitteePositionTag({
  committeePosition,
  includeImage = true,
  includeAt = true,
  children,
}: {
  committeePosition: CommitteePosition
  includeImage?: boolean
  includeAt?: boolean
  children?: React.ReactNode
}) {
  return (
    <HoverCard>
      <HoverCardTrigger className='flex items-center' asChild>
        <Button
          variant='link'
          className='text-black dark:text-yellow-400 pl-0'
          style={{ fontSize: 'inherit' }}
        >
          {/*includeImage && (
            <Avatar className='w-8 h-8 mr-2'>
              <AvatarImage
                src={committeePosition.logo_url ?? ''}
                alt={committee.title}
              />
              <AvatarFallback>
                {committee.title + ' Profile Picture'}
              </AvatarFallback>
          </Avatar>
          )}*/}
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
