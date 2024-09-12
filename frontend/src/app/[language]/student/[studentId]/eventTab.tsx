import Student from '@/models/Student'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { TagIcon } from '@heroicons/react/24/outline'
import { GetStudentEvents } from '@/api/student'

export default async function StudentEvents({
  language,
  student,
}: {
  language: string
  student: Student
}) {
  const events = await GetStudentEvents(student.email, language)

  if (!events) return <></>

  if (events.total_items === 0) {
    return (
      <div>
        <h2>No events yet</h2>
      </div>
    )
  }
  return (
    <div className='flex flex-col'>
      <h2 className='text-2xl border-b-2 border-yellow-400 py-1 mb-1 dark:text-white'>
        Published Events
      </h2>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[650px]'>Title</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.items
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((event, index) => (
                <TableRow key={index}>
                  <TableCell
                    className='max-w-[650px] truncate border-l-8 dark:text-white'
                    style={{
                      borderLeftColor: event.background_color,
                    }}
                  >
                    {event.translations[0].title}
                  </TableCell>
                  <TableCell className='dark:text-white'>
                    {new Date(event.created_at).toLocaleDateString(language, {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className='dark:text-white'>
                    {new Date(
                      new Date(event.start_date).getTime() +
                        event.duration * 60000
                    ) > new Date() &&
                    new Date(event.start_date) < new Date() ? (
                      <div className='flex h-full items-center gap-2'>
                        <div className='w-3 h-3 bg-lime-500 rounded-full animate-pulse' />
                        <span className=''>Ongoing</span>
                      </div>
                    ) : new Date(
                        new Date(event.start_date).getTime() +
                          event.duration * 60000
                      ) < new Date() ? (
                      <div className='flex h-full items-center gap-2'>
                        <div className='w-3 h-3 bg-red-500 rounded-full' />
                        <span className=''>Ended</span>
                      </div>
                    ) : (
                      <div className='flex h-full items-center gap-2'>
                        <div className='w-3 h-3 bg-yellow-500 rounded-full' />
                        <span className=''>Upcoming</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className='dark:text-white'>
                    {new Date(event.start_date).toLocaleDateString(language, {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className='dark:text-white'>
                    {new Date(
                      new Date(event.start_date).getTime() +
                        event.duration * 60000
                    ).toLocaleDateString(language, {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className='flex gap-2 dark:text-white'>
                    <Button
                      variant='outline'
                      size='icon'
                      title='Tags'
                      aria-label='Tags'
                    >
                      <TagIcon className='w-6 h-6' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
