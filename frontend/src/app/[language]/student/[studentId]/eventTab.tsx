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
import { LinkIcon, TagIcon } from '@heroicons/react/24/outline'
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
      <h2 className='text-2xl border-b-2 border-yellow-400 py-1 mb-1'>
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
            {events.items.map((event, index) => (
              <TableRow key={index}>
                <TableCell className='max-w-[650px] truncate'>
                  {event.translations[0].title}
                </TableCell>
                <TableCell>
                  {new Date(event.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(event.start_date) >= new Date() &&
                  new Date(event.end_date) <= new Date() ? (
                    <span className='text-green-500'>Ongoing</span>
                  ) : new Date(event.end_date) < new Date() ? (
                    <span className='text-red-500'>Ended</span>
                  ) : (
                    <span className='text-yellow-500'>Upcoming</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(event.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(event.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant='outline'
                    size='icon'
                    title='Tags'
                    aria-label='Tags'
                  >
                    <TagIcon className='w-6 h-6' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    title='Share'
                    aria-label='Share'
                  >
                    <LinkIcon className='w-6 h-6' />
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
