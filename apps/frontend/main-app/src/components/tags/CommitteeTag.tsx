import { CommitteeTooltip } from '@/components/tooltips/Tooltip'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import Image from 'next/image'
import { forwardRef } from 'react'

interface CommitteeTagProps {
  committee: Committee
  language: LanguageCode
  allowHover?: boolean
  includeImage?: boolean
  includeAt?: boolean
  includeBackground?: boolean
  reverseImage?: boolean
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
const CommitteeTag = forwardRef<HTMLButtonElement, CommitteeTagProps>(
  (
    {
      committee,
      language,
      includeImage = false,
      includeAt = false,
      includeBackground = false,
      reverseImage = false,
      children,
    },
    ref
  ) => {
    return (
      <HoverCard>
        <HoverCardTrigger
          className={`${includeAt ? 'inline-block' : 'flex items-center'}`}
          style={{
            fontWeight: 'inherit',
          }}
          asChild
        >
          <Button
            variant='link'
            className={`h-fit text-inherit flex justify-start text-start ${
              includeBackground
                ? 'dark:text-yellow-400 bg-yellow-400/30 dark:bg-yellow-400/20 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                : ''
            } 
              ${reverseImage ? 'flex-row-reverse *:ml-2' : 'flex-row *:mr-2'}
            p-0 max-w-full`}
            style={{ fontSize: 'inherit', width: 'inherit' }}
            ref={ref}
            tabIndex={-1}
          >
            {includeImage && (
              <div className='bg-white rounded-full overflow-hidden'>
                <Image
                  className='h-10 w-auto aspect-square object-fill p-1.5'
                  width={128}
                  height={128}
                  unoptimized // Logo is an SVG
                  src={committee.logo_url}
                  alt={`${committee.translations[0].title} logo`}
                />
              </div>
            )}
            <div
              className='flex flex-col text-start overflow-hidden'
              style={{
                fontWeight: 'inherit',
              }}
            >
              <p className='truncate'>
                {(includeAt ? '@' : '') + committee.translations[0].title}
              </p>
              {children}
            </div>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <CommitteeTooltip committee={committee} language={language} />
        </HoverCardContent>
      </HoverCard>
    )
  }
)
CommitteeTag.displayName = 'CommitteeTag'
export default CommitteeTag
