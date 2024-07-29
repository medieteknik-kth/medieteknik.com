import Events from './events'
import Recruitment from './recruiting'
import ExtraNews from './extranews'
import BreakingNews from './breakingNews'
import CalendarProvider from '@/providers/CalendarProvider'

/**
 * Renders the bulletin page
 * @name Bulletin
 * @description Renders the bulletin page
 *
 * @param {object} params - The dynamic route parameters
 * @param {string} params.language - The language of the page
 * @returns {JSX.Element} The bulletin page
 */
export default async function Bulletin({
  params: { language },
}: {
  params: { language: string }
}): Promise<JSX.Element> {
  // TODO: Potentially retrieve events only once?
  return (
    <main className='px-12'>
      <div className='h-24' />
      <BreakingNews language={language} />
      <CalendarProvider language={language}>
        <Events language={language} />
      </CalendarProvider>
      <Recruitment language={language} />
      <ExtraNews language={language} />
    </main>
  )
}
