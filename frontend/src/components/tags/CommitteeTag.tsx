import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { CommitteeTooltip } from '@components/tooltips/Tooltip'
import { Button } from '@components/ui/button'
import Committee from '@/models/Committee'
import { forwardRef } from 'react'

export const CommitteeTag = forwardRef<
  HTMLButtonElement,
  {
    committee: Committee
    includeImage?: boolean
    includeAt?: boolean
    children?: React.ReactNode
  }
>(({ committee, includeImage = true, includeAt = true, children }, ref) => {
  return (
    <HoverCard>
      <HoverCardTrigger className='inline-block' asChild>
        <Button
          variant='link'
          className='h-fit text-black dark:text-yellow-400 bg-yellow-400/30 dark:bg-yellow-400/20 py-0 px-1'
          style={{ fontSize: 'inherit' }}
          ref={ref}
        >
          {includeImage && (
            <Avatar className='w-8 h-8 mr-2'>
              <AvatarImage
                src={committee.logo_url ?? ''}
                alt={committee.translations[0].title}
              />
              <AvatarFallback>
                {committee.translations[0].title + ' Profile Picture'}
              </AvatarFallback>
            </Avatar>
          )}
          <p>
            {(includeAt ? '@' : '') + committee.translations[0].title}
            {children}
          </p>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <CommitteeTooltip committee={committee} />
      </HoverCardContent>
    </HoverCard>
  )
})
