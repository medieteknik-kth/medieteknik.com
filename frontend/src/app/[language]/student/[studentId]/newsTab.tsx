import Student from '@/models/Student'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Logo from 'public/images/logo.png'
import { Button } from '@/components/ui/button'
import { LinkIcon, TagIcon, Cog8ToothIcon } from '@heroicons/react/24/outline'

export default function StudentNews({
  language,
  student,
}: {
  language: string
  student: Student
}) {
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
                <Button
                  variant='outline'
                  size='icon'
                  title='Edit News'
                  aria-label='Edit News'
                >
                  <Cog8ToothIcon className='w-6 h-6' />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
