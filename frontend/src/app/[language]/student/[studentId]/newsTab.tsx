import Student from '@/models/Student'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GetStudentNews } from '@/api/student'
import EditNewsButton from './client/editNewsButton'
import CopyButton from './client/copyButton'

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
                <TableCell className='flex gap-2'>
                  <CopyButton
                    language={language}
                    url={`/bulletin/news/${item.url}`}
                  />
                  <EditNewsButton
                    language={language}
                    currentStudent={student}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
