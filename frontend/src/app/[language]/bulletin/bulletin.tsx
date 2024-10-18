import { GetRecruitment } from '@/api/committee'
import { GetBreakingNews } from '@/api/items'
import CalendarProvider from '@/providers/CalendarProvider'
import BreakingNews from './client/breakingNews'
import Events from './client/events'
import ExtraNewsObserver from './client/extranewsObserver'
import Recruitment from './recruiting'

export const revalidate = 60 * 60 * 24 // 1 day

/**
 * @name Bulletin
 * @description Renders the bulletin page
 *
 * @param {object} params - The dynamic route parameters
 * @param {string} params.language - The language of the page
 *
 * @returns {JSX.Element} The bulletin page
 */
export default async function Bulletin({
  params: { language },
}: {
  params: { language: string }
}): Promise<JSX.Element> {
  const recruitmentData = await GetRecruitment(language)
  const breakingNewsData = await GetBreakingNews(language)

  return (
    <main className='px-12 flex flex-col gap-2'>
      <div className='h-24' />
      <BreakingNews language={language} data={breakingNewsData} />
      <CalendarProvider language={language}>
        <Events language={language} />
      </CalendarProvider>
      <Recruitment language={language} data={recruitmentData} />
      <ExtraNewsObserver language={language} />
    </main>
  )
}
