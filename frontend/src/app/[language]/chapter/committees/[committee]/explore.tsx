'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DocumentDuplicateIcon,
  GlobeAltIcon,
  HashtagIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

export default function ExploreMore({
  language,
  committee,
}: {
  language: string
  committee: string
}) {
  const committeeName = decodeURIComponent(committee)

  return (
    <section className='h-fit'>
      <div className='pt-12 mb-10 grid place-items-center'>
        <h2 className='text-3xl capitalize'>Explore More</h2>
        <div className='flex flex-wrap gap-12 justify-center my-8'>
          <Card
            className='bg-yellow-100 dark:bg-yellow-300 hover:scale-110 transition-transform cursor-pointer dark:text-black'
            onClick={() => {
              location.href = '/recruitment?committee=' + committee
            }}
          >
            <CardHeader>
              <div className='w-16 h-16 grid place-items-center border rounded-full bg-yellow-400 dark:bg-yellow-500'>
                <UsersIcon className='w-6 h-6 text-white' />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle>Recruitment</CardTitle>
              <p className='max-w-xs'>
                Want to be part of{' '}
                <span className='capitalize font-bold'>{committeeName}</span>?
                Click here to see active recruitment.
              </p>
            </CardContent>
          </Card>
          <Card
            className='bg-red-100 dark:bg-red-300 hover:scale-110 transition-transform cursor-pointer dark:text-black'
            onClick={() => {
              location.href = '/bulletin?committee=' + committee
            }}
          >
            <CardHeader>
              <div className='w-16 h-16 grid place-items-center border rounded-full bg-red-400 dark:bg-red-500'>
                <DocumentDuplicateIcon className='w-6 h-6 text-white' />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle>News and Events</CardTitle>
              <p className='max-w-xs'>
                See the latest news and events from{' '}
                <span className='capitalize font-bold'>{committeeName}</span>.
              </p>
            </CardContent>
          </Card>
          <Card
            className='bg-sky-100 dark:bg-sky-300 hover:scale-110 transition-transform cursor-pointer dark:text-black'
            onClick={() => {
              location.href = '/bulletin?committee=' + committee
            }}
          >
            <CardHeader>
              <div className='w-16 h-16 grid place-items-center border rounded-full bg-sky-400 dark:bg-sky-500'>
                <HashtagIcon className='w-6 h-6 text-white' />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle>Social Media</CardTitle>
              <p className='max-w-xs'>
                Follow us on social media and see what happens in{' '}
                <span className='capitalize font-bold'>{committeeName}</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
