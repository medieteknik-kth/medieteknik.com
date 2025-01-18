import CommitteeTag from '@/components/tags/CommitteeTag'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { CommitteePositionRecruitment } from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { ClockIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import type { JSX } from 'react'

interface Props {
  language: LanguageCode
  recruitment: CommitteePositionRecruitment
}

/**
 * @name RecruitmentCard
 * @description This component is used to display a recruitment card that is used when displaying recruitments on the bulletin page.
 *
 * @param {Props} props
 * @param {string} props.language - The language of the recruitment
 * @param {CommitteePositionRecruitment} props.recruitment - The recruitment to display
 *
 * @returns {JSX.Element} The recruitment card component
 */
export default function RecruitmentCard({
  language,
  recruitment,
}: Props): JSX.Element {
  return (
    <Card className='w-full sm:w-[470px] h-fit md:min-h-[260px] relative flex flex-col justify-between'>
      <CardHeader>
        <CardTitle className='text-sm xxs:text-base sm:text-xl flex justify-between'>
          {recruitment.committee_position.committee && (
            <CommitteeTag
              committee={recruitment.committee_position.committee}
              includeAt={false}
              includeBackground={false}
            />
          )}
          <span
            className='text-sm flex items-center font-normal text-neutral-700 dark:text-neutral-300'
            title={new Date(recruitment.end_date).toLocaleDateString(language, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          >
            <ClockIcon className='w-4 h-4 mr-1' />
            {Math.floor(
              (new Date(recruitment.end_date).getTime() - Date.now()) /
                1000 /
                60 /
                60 /
                24
            )}{' '}
            days left
          </span>
        </CardTitle>
        <CardDescription className='flex items-center mt-1'>
          <span className='font-mono uppercase text-xs select-none'>
            Position: {recruitment.committee_position.translations[0].title}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className='text-sm w-full max-w-[450px] text-pretty break-words whitespace-pre-line'>
        <p>{recruitment.translations[0].description}</p>
      </CardContent>
      <CardFooter className='h-fit'>
        <Button
          title='Learn More'
          aria-label='Learn More'
          asChild
          className='w-full'
        >
          <Link
            href={recruitment.translations[0].link_url}
            target='_blank'
            rel='noopener noreferrer'
            title='Learn More About the Position'
          >
            Learn More
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
