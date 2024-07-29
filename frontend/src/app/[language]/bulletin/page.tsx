import Events from './events'
import Recruiting from './recruiting'
import ExtraNews from './extranews'
import BreakingNews from './breakingNews'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CalendarProvider from '@/providers/CalendarProvider'

export default async function News({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main className='px-12'>
      <div className='h-24' />
      <BreakingNews language={language} />
      <CalendarProvider>
        <Events language={language} />
      </CalendarProvider>
      <Recruiting language={language} />
      <ExtraNews language={language} />
    </main>
  )
}
