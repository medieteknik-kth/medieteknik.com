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
    <main>
      <div className='h-24' />
      <div className='w-full h-fit flex flex-col justify-center px-12'>
        <div className='h-fit flex justify-between items-center'>
          <h2 className='uppercase text-neutral-600 dark:text-neutral-400 py-2 text-lg tracking-wide'>
            Breaking News
          </h2>
          <Button
            asChild
            variant='link'
            className='text-sky-800 dark:text-sky-400'
          >
            <Link href='./bulletin/news'>View All</Link>
          </Button>
        </div>
        <div className='w-full relative overflow-x-auto'>
          <BreakingNews language={language} />
        </div>
      </div>
      <CalendarProvider>
        <Events language={language} />
      </CalendarProvider>
      <Recruiting />
      <ExtraNews />
    </main>
  )
}
