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
import { GetStudentNews } from '@/api/student'
import EditNewsButton from './client/editNewsButton'

export default async function StudentNews({
  language,
  student,
}: {
  language: string
  student: Student
}) {
  const news = await GetStudentNews(student.email, language)

  if (!news) return <></>

  if (news.total_items === 0) {
    return (
      <div>
        <h2>No news yet</h2>
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      <h2 className='text-2xl border-b-2 border-yellow-400 py-1 mb-1'>
        Published News
      </h2>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[650px]'>Title</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.items.map((item) => (
              <TableRow key={item.url}>
                <TableCell className='max-w-[650px] truncate'>
                  {item.translations[0].title}
                </TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className='max-w-[650px] truncate'>
                News Title
              </TableCell>
              <TableCell>
                {new Date('January 20 2024').toLocaleDateString()}
              </TableCell>
              <TableCell className='grid grid-cols-3 gap-2'>
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
                <EditNewsButton language={language} currentStudent={student} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
