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

interface CommitteeTagProps {
  committee: Committee
  includeImage?: boolean
  includeAt?: boolean
  includeBackground?: boolean
  children?: React.ReactNode
}

/**
 * @name CommitteeTag
 * @description A tag component for committee
 *
 * @param {CommitteeTagProps} props - The props for the component
 * @param {Committee} props.committee - The committee to display
 * @param {boolean} props.includeImage - Whether to include the image
 * @param {boolean} props.includeAt - Whether to include the @ symbol
 * @param {React.ReactNode} props.children - The children
 *
 * @returns {ForwardRefExoticComponent<CommitteeTagProps & RefAttributes<HTMLButtonElement>>} The component
 */
export const CommitteeTag = forwardRef<HTMLButtonElement, CommitteeTagProps>(
  (
    {
      committee,
      includeImage = true,
      includeAt = true,
      includeBackground = true,
      children,
    },
    ref
  ) => {
    return (
      <HoverCard>
        <HoverCardTrigger
          className={`${includeAt ? 'inline-block' : 'flex items-center'}`}
          asChild
        >
          <Button
            variant='link'
            className={`h-fit text-inherit hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
              includeBackground
                ? 'dark:text-yellow-400 bg-yellow-400/30 dark:bg-yellow-400/20 '
                : ''
            } py-0 px-1 max-w-full`}
            style={{ fontSize: 'inherit' }}
            ref={ref}
          >
            {includeImage && (
              <Avatar className='w-10 h-10 mr-2 rounded-full'>
                <AvatarImage
                  src={committee.logo_url ?? ''}
                  alt={committee.translations[0].title}
                />
                <AvatarFallback>
                  {committee.translations[0].title + ' Profile Picture'}
                </AvatarFallback>
              </Avatar>
            )}
            <div className='flex flex-col text-start overflow-hidden'>
              <p className='truncate'>
                {(includeAt ? '@' : '') + committee.translations[0].title}
              </p>
              {children}
            </div>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <CommitteeTooltip committee={committee} />
        </HoverCardContent>
      </HoverCard>
    )
  }
)
