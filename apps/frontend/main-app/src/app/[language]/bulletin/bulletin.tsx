import { getRecruitment } from '@/api/committee_position'
import HeaderGap from '@/components/header/components/HeaderGap'
import type { LanguageCode } from '@/models/Language'
import CalendarProvider from '@/providers/CalendarProvider'
import type { JSX } from 'react'
import BreakingNews from './client/breakingNews'
import Events from './client/events'
import ExtraNewsObserver from './client/extranewsObserver'
import Recruitment from './recruiting'

interface Params {
  language: LanguageCode
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
  const { data: recruitmentData } = await getRecruitment(language, 0)

  return (
    <main className='px-2 sm:px-5 md:px-12 flex flex-col gap-2'>
      <HeaderGap />
      <BreakingNews language={language} />
      <div className='flex gap-4 desktop:gap-2 justify-items-stretch flex-col desktop:flex-row mt-2'>
        <CalendarProvider language={language}>
          <Events language={language} />
        </CalendarProvider>
        <Recruitment language={language} data={recruitmentData} />
      </div>
      <ExtraNewsObserver language={language} />
    </main>
  )
}
