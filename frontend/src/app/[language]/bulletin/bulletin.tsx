import { getRecruitment } from '@/api/committee'
import HeaderGap from '@/components/header/components/HeaderGap'
import CalendarProvider from '@/providers/CalendarProvider'
import BreakingNews from './client/breakingNews'
import Events from './client/events'
import ExtraNewsObserver from './client/extranewsObserver'
import Recruitment from './recruiting'

import type { JSX } from 'react'

interface Params {
  language: string
}

interface Props {
  params: Promise<Params>
}

/**
 * @name Bulletin
 * @description Renders the bulletin page
 *
 * @param {object} params - The dynamic route parameters
 * @param {string} params.language - The language of the page
 *
 * @returns {JSX.Element} The bulletin page
 */
export default async function Bulletin(props: Props): Promise<JSX.Element> {
  const { language } = await props.params
  const { data: recruitmentData } = await getRecruitment(language)

  return (
    <main className='px-4 sm:px-12 flex flex-col gap-2'>
      <HeaderGap />
      <BreakingNews language={language} />
      <CalendarProvider language={language}>
        <Events language={language} />
      </CalendarProvider>
      <Recruitment language={language} data={recruitmentData} />
      <ExtraNewsObserver language={language} />
    </main>
  )
}
