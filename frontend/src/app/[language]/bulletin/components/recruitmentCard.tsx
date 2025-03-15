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
import { Link } from 'next-view-transitions'
import Image from 'next/image'

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
      <CardHeader className='flex flex-col'>
        <CardTitle>
          {recruitment.committee_position.committee && (
            <div className='flex items-center gap-2'>
              <div className='bg-white rounded-full p-1 w-16 overflow-hidden'>
                <Image
                  src={recruitment.committee_position.committee.logo_url}
                  alt={
                    recruitment.committee_position.committee.translations[0]
                      .title
                  }
                  unoptimized // Logo is an SVG
                  width={64}
                  height={64}
                  className=''
                />
              </div>
              <div className='flex flex-col'>
                <CommitteeTag
                  committee={recruitment.committee_position.committee}
                  language={language}
                />
                <CardDescription className='flex items-center'>
                  <ClockIcon className='w-4 h-4 mr-1' />
                  {Math.floor(
                    (new Date(recruitment.end_date).getTime() - Date.now()) /
                      1000 /
                      60 /
                      60 /
                      24
                  )}{' '}
                  days left
                </CardDescription>
              </div>
            </div>
          )}
        </CardTitle>

        <CardTitle className='text-lg text-primary'>
          {recruitment.committee_position.translations[0].title}
        </CardTitle>
      </CardHeader>

      <CardContent className='text-sm text-gray-600 dark:text-gray-300 break-words whitespace-pre-line'>
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
