'use client'

import { useTranslation } from '@/app/i18n/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LanguageCode } from '@/models/Language'
import { IndividualCommitteePosition } from '@/models/Student'
import Image from 'next/image'
import FallbackLogo from 'public/images/logo.webp'
import { type JSX } from 'react'
import { Timeline } from 'rsuite'
import './positions.css'

interface Props {
  language: LanguageCode
  positions: IndividualCommitteePosition[]
}

/**
 * @name StudentPositions
 * @description Displays a timeline of the student's positions, grouped by committee and sorted by initiation date
 *
 * @param {Props} props - The component properties
 * @param {LanguageCode} props.language - The language code
 * @param {IndividualCommitteePosition[]} props.positions - The student's positions
 * @returns {JSX.Element} The student's positions
 */
export default function StudentPositions({
  language,
  positions,
}: Props): JSX.Element {
  const { t } = useTranslation(language, 'student/student')
  if (positions.length === 0) {
    return <div className='w-full h-8' />
  }

  const createCommitteeHeaderArray = (
    positions: IndividualCommitteePosition[]
  ) => {
    const sortedPositions = positions.sort(
      (a, b) =>
        new Date(b.initiation_date).getTime() -
        new Date(a.initiation_date).getTime()
    )

    const timelineItems: {
      type: 'header' | 'position'
      committee?: any
      position?: any
      key: string
    }[] = []

    sortedPositions.forEach((position, index) => {
      // Check if this is the first position or if the committee has changed
      const isNewCommittee =
        index === 0 ||
        sortedPositions[index - 1].position.committee?.committee_id !==
          position.position.committee?.committee_id

      // Add committee header if it's a new committee
      if (isNewCommittee) {
        timelineItems.push({
          type: 'header',
          committee: position.position.committee,
          key: `header-${index}`,
        })
      }

      // Add the position item
      timelineItems.push({
        type: 'position',
        position: position,
        key: `position-${index}`,
      })
    })

    return timelineItems
  }

  const combinedPositions = createCommitteeHeaderArray(positions)

  return (
    <section className='w-full h-fit text-black mt-8'>
      <div className='mt-2 mx-2 md:mx-20 lg:mx-32 xl:mx-72 bg-[#EEE] dark:bg-[#222] border-t-4 border-yellow-400 px-8 py-4'>
        <div className='flex gap-4 items-center pb-4'>
          <h2 className='text-2xl dark:text-white font-semibold text-pretty tracking-tight'>
            {t('positions')}
          </h2>
        </div>
        <div className='mx-5 mt-2'>
          <Timeline
            className='dark:text-white yellow-400'
            isItemActive={(index) => {
              if (combinedPositions[index].type === 'header') {
                return false
              }
              return (
                combinedPositions[index].position.termination_date === null ||
                new Date(combinedPositions[index].position.termination_date) >
                  new Date()
              )
            }}
          >
            {combinedPositions.map((item) => {
              if (item.type === 'header') {
                return (
                  <Timeline.Item
                    className='h-16'
                    key={item.key}
                    dot={
                      <Avatar className='w-12 h-auto aspect-square border border-yellow-400 p-1 bg-white absolute -left-5 -top-4 grid place-items-center rounded-md shadow-md'>
                        <AvatarImage
                          src={item.committee && item.committee.logo_url}
                          alt='Profile Picture'
                          className='rounded-md'
                        />
                        <AvatarFallback className='bg-white'>
                          <Image
                            src={FallbackLogo}
                            alt='Logo'
                            width={64}
                            height={64}
                            className='object-cover'
                          />
                        </AvatarFallback>
                      </Avatar>
                    }
                  >
                    <h3 className='w-fit font-semibold dark:text-white pl-4 xs:text-lg'>
                      {item.committee
                        ? item.committee.translations[0].title
                        : t('unknownCommittee')}
                    </h3>
                  </Timeline.Item>
                )
              } else {
                return (
                  <Timeline.Item className='h-20' key={item.key}>
                    <p className='text-muted-foreground dark:text-neutral-300 select-none leading-tight text-xs xs:text-sm'>
                      {new Date(
                        item.position.initiation_date
                      ).toLocaleDateString()}{' '}
                      -{' '}
                      {item.position.termination_date
                        ? new Date(
                            item.position.termination_date
                          ).toLocaleDateString()
                        : t('present')}
                    </p>
                    <h4 className='text-sm xs:text-base dark:text-white'>
                      {item.position.position.translations[0].title}
                    </h4>
                  </Timeline.Item>
                )
              }
            })}
          </Timeline>
        </div>
      </div>
    </section>
  )
}
